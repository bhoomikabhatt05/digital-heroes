import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expected = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
    if (expected !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const event = payload.event as string;

    // Handle relevant lifecycle events without over-engineering
    // For now, log and acknowledge. Subscription state is managed via verify endpoint.
    // Extend here to handle payment.captured -> ensure active, payment.failed -> past_due, etc.
    if (event === "payment.captured" || event === "payment.failed" || event === "subscription.activated" || event === "subscription.cancelled") {
      console.log(`Razorpay webhook: ${event}`, payload.payload?.payment?.entity?.id || payload.payload?.subscription?.entity?.id);
    }

    return NextResponse.json({ received: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Razorpay webhook error:", msg);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
