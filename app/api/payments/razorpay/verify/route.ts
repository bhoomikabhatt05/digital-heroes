import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return NextResponse.json({ error: "Missing payment verification details." }, { status: 400 });
    }
    if (!["monthly", "yearly"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Online payment is currently unavailable. Please try again later." }, { status: 503 });
    }

    // Verify signature server-side — never trust client callback
    const expected = crypto.createHmac("sha256", keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");

    if (expected !== razorpay_signature) {
      console.warn("Razorpay signature verification failed", { razorpay_order_id });
      return NextResponse.json({ error: "Payment verification failed. Please contact support." }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Online payment is currently unavailable. Please try again later." }, { status: 503 });
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in again." }, { status: 401 });
    }

    // Verified — update subscription
    const now = new Date();
    const periodEnd = new Date(now);
    if (plan === "monthly") periodEnd.setMonth(periodEnd.getMonth() + 1);
    else periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    const amountPaise = plan === "monthly" ? 2000 * 100 : 20000 * 100;

    // Upsert subscription - reuse existing table, store Razorpay ids in stripe fields for compatibility
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let subscriptionId: string | null = existing?.id ?? null;

    if (existing) {
      const { error: updErr } = await supabase
        .from("subscriptions")
        .update({
          plan,
          status: "active",
          stripe_subscription_id: razorpay_order_id,
          stripe_customer_id: razorpay_payment_id,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan,
          status: "active",
          stripe_subscription_id: razorpay_order_id,
          stripe_customer_id: razorpay_payment_id,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        })
        .select("id")
        .single();
      if (insErr) throw insErr;
      subscriptionId = inserted?.id ?? null;
    }

    // Record payment in payments table if available (reuse stripe_payment_id for Razorpay)
    try {
      await supabase.from("payments").insert({
        user_id: user.id,
        subscription_id: subscriptionId,
        stripe_payment_id: razorpay_payment_id,
        amount: amountPaise / 100,
        currency: "INR",
        status: "succeeded",
      });
    } catch {
      // payments table optional — don't fail verification if missing
    }

    return NextResponse.json({ success: true, plan, status: "active" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Razorpay verify error:", msg);
    return NextResponse.json({ error: "Payment verification failed. Please contact support." }, { status: 500 });
  }
}
