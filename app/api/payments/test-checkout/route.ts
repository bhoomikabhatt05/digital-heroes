import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Use existing pricing amounts — GBP £20 / £200, stored as INR paise for compatibility but display as GBP
const PLAN_CONFIG: Record<string, { amount: number; currency: string; label: string; display: string }> = {
  monthly: { amount: 2000, currency: "GBP", label: "Monthly", display: "£20/month" },
  yearly: { amount: 20000, currency: "GBP", label: "Yearly", display: "£200/year" },
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan || !PLAN_CONFIG[plan]) {
      return NextResponse.json({ error: "Invalid plan. Use monthly or yearly." }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Online payment is currently unavailable. Please try again later." }, { status: 503 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to complete test payment." }, { status: 401 });
    }

    // Validate plan and determine amount server-side — never trust client amount
    const cfg = PLAN_CONFIG[plan];
    const amount = cfg.amount; // in pence for GBP display, server-determined
    const currency = cfg.currency;

    const now = new Date();
    const periodEnd = new Date(now);
    if (plan === "monthly") periodEnd.setMonth(periodEnd.getMonth() + 1);
    else periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    const testRef = `TEST_PAYMENT_${Date.now()}_${user.id.slice(0, 8)}`;

    // Upsert subscription — use authenticated user ID only, never client user_id
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
          stripe_subscription_id: testRef,
          stripe_customer_id: `TEST_${user.id.slice(0, 8)}`,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        })
        .eq("id", existing.id)
        .eq("user_id", user.id);
      if (updErr) throw updErr;
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan,
          status: "active",
          stripe_subscription_id: testRef,
          stripe_customer_id: `TEST_${user.id.slice(0, 8)}`,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        })
        .select("id")
        .single();
      if (insErr) throw insErr;
      subscriptionId = inserted?.id ?? null;
    }

    // Record test payment — clearly identifiable, never real Stripe/Razorpay id
    try {
      await supabase.from("payments").insert({
        user_id: user.id,
        subscription_id: subscriptionId,
        stripe_payment_id: testRef,
        amount: amount / 100,
        currency,
        status: "test_succeeded",
      });
    } catch {
      // payments table optional — don't fail if missing
    }

    return NextResponse.json({
      success: true,
      test: true,
      message: "Test subscription activated — no real money charged.",
      plan,
      amount,
      currency,
      reference: testRef,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Test checkout error:", msg);
    return NextResponse.json({ error: "Test payment failed. Please try again." }, { status: 500 });
  }
}
