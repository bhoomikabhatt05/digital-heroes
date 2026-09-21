import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PLAN_AMOUNTS: Record<string, { amount: number; currency: string; display: string }> = {
  monthly: { amount: 2000 * 100, currency: "INR", display: "£20/month" }, // 2000 INR test = £20 numeric
  yearly: { amount: 20000 * 100, currency: "INR", display: "£200/year" },
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan || !PLAN_AMOUNTS[plan]) {
      return NextResponse.json({ error: "Invalid plan. Use monthly or yearly." }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Online payment is currently unavailable. Please try again later.", demo: true },
        { status: 503 }
      );
    }

    // Auth required - use Supabase server client
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Online payment is currently unavailable. Please try again later." }, { status: 503 });
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to subscribe." }, { status: 401 });
    }

    const { amount, currency } = PLAN_AMOUNTS[plan];

    // Create Razorpay order server-side (never trust client amount)
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `dh_${user.id.slice(0, 8)}_${plan}_${Date.now()}`,
      notes: { plan, user_id: user.id },
    });

    // Return only public checkout info - never secret
    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
      plan,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Razorpay order error:", msg);
    return NextResponse.json({ error: "Online payment is currently unavailable. Please try again later." }, { status: 500 });
  }
}
