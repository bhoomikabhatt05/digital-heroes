import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { plan } = await req.json();
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ demo: true, message: "Stripe not configured — demo mode", plan });
  }
  // Real Stripe would create session here
  // For assignment: return demo URL
  return NextResponse.json({ url: null, demo: true, plan });
}
