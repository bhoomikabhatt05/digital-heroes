"use client";
import { useState } from "react";
import { Navbar, Footer } from "@/components/landing/navbar";
import { Card, DarkCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const features = [
  "Track unlimited scores (latest 5 retained)",
  "Automatic monthly draw entry",
  "Choose charity + set % (min 10%)",
  "Winnings & verification dashboard",
  "Cancel anytime",
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);
  const [testPlan, setTestPlan] = useState<"monthly" | "yearly" | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleTestCheckout() {
    if (!testPlan) return;
    setTestLoading(true);
    try {
      const res = await fetch("/api/payments/test-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: testPlan }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Test payment failed.", "error");
        setTestLoading(false);
        return;
      }
      toast("Test subscription activated — no real money charged.", "success");
      setTestPlan(null);
      router.push("/dashboard");
    } catch {
      toast("Test payment failed. Please try again.", "error");
    }
    setTestLoading(false);
  }

  async function handleCheckout(plan: "monthly" | "yearly") {
    if (!isSupabaseConfigured()) {
      toast("Online payment is currently unavailable. Please try again later.", "info");
      return;
    }
    setLoading(plan);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signup");
        return;
      }

      const orderRes = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        // Fallback to clearly labelled TEST CHECKOUT when real gateway unavailable
        if (orderRes.status === 503 || orderData.error?.toLowerCase().includes("unavailable")) {
          setTestPlan(plan);
          setLoading(null);
          return;
        }
        toast(orderData.error || "Online payment is currently unavailable. Please try again later.", "info");
        setLoading(null);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast("Online payment is currently unavailable. Please try again later.", "info");
        setLoading(null);
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("full_name,email").eq("id", user.id).single();

      const options: Record<string, unknown> = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Digital Heroes",
        description: plan === "monthly" ? "Monthly — £20/month" : "Yearly — £200/year",
        order_id: orderData.order_id,
        prefill: {
          name: profile?.full_name || user.user_metadata?.full_name || "",
          email: profile?.email || user.email || "",
        },
        theme: { color: "#C8FF3D" },
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              toast(verifyData.error || "Payment verification failed.", "error");
              return;
            }
            toast("Payment verified — subscription active!", "success");
            router.push("/dashboard");
          } catch {
            toast("Payment verification failed. Please contact support.", "error");
          }
        },
        modal: {
          ondismiss: function () {
            toast("Checkout cancelled — subscription not activated.", "info");
            setLoading(null);
          },
        },
      };

      const rzp = new (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void; on: (ev: string, cb: () => void) => void } }).Razorpay(options);
      rzp.on("payment.failed", function () {
        toast("Payment failed — subscription not activated.", "error");
        setLoading(null);
      });
      rzp.open();
    } catch {
      toast("Online payment is currently unavailable. Please try again later.", "info");
    }
    setLoading(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-[1160px] px-6 py-12 md:py-16">
        <div className="mx-auto max-w-[640px] text-center">
          <h1 className="text-[34px] md:text-[40px] font-bold tracking-[-0.03em] leading-[1.05] text-[#111113]">Simple pricing. Serious impact.</h1>
          <p className="mt-3 text-[15px] leading-6 text-[#6B6B78]">Pick your plan. Change or cancel anytime.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-5 max-w-[760px] mx-auto">
          <Card className="p-6 md:p-7 flex flex-col">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#5F5F5A]">Monthly</p>
            <p className="mt-3 text-[32px] font-bold tracking-[-0.03em] leading-none text-[#111113]">
              £20<span className="text-[14px] font-normal text-[#6B6B78]">/month</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-[13.5px] leading-6">
              {features.map((f) => (
                <li key={f} className="flex gap-2.5 text-[#3A3A40]">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full h-11 mt-7" onClick={() => handleCheckout("monthly")} disabled={loading !== null}>
              {loading === "monthly" ? "Processing..." : "Choose Monthly"}
            </Button>
          </Card>

          <Card className="p-6 md:p-7 flex flex-col border-[#111113] shadow-[0_8px_24px_rgba(0,0,0,0.08)] relative">
            <div className="absolute -top-3 left-6">
              <Badge variant="lime" className="shadow-sm">Most popular — Save 17%</Badge>
            </div>
            <p className="mt-4 text-xs font-semibold tracking-[0.14em] uppercase text-[#5F5F5A]">Yearly</p>
            <p className="mt-3 text-[32px] font-bold tracking-[-0.03em] leading-none text-[#111113]">
              £200<span className="text-[14px] font-normal text-[#6B6B78]">/year</span>
            </p>
            <p className="text-xs font-medium text-[#5F5F5A] mt-1">£16.67/mo billed annually</p>
            <ul className="mt-6 space-y-2.5 text-[13.5px] leading-6">
              {features.map((f) => (
                <li key={f} className="flex gap-2.5 text-[#3A3A40]">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full h-11 mt-7" onClick={() => handleCheckout("yearly")} disabled={loading !== null}>
              {loading === "yearly" ? "Processing..." : "Choose Yearly"}
            </Button>
          </Card>
        </div>

        <DarkCard className="mt-8 max-w-[760px] mx-auto p-6 flex gap-4">
          <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white text-sm border border-white/15">◉</div>
          <div>
            <p className="text-[13.5px] font-semibold tracking-[-0.01em] text-white">Secure checkout</p>
            <p className="mt-1 text-[13.5px] leading-6 text-white/60">
              PCI-compliant checkout via Razorpay TEST MODE. Subscription activates only after payment verification.
            </p>
          </div>
        </DarkCard>
      </div>

      {testPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={() => setTestPlan(null)}>
          <div className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-[#0B0B0C] p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#C8FF3D] px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#0B0B0C]">TEST PAYMENT</span>
              <span className="text-[11px] font-medium tracking-wide text-white/60">Assignment Demo</span>
            </div>
            <h3 className="mt-4 text-[18px] font-bold tracking-[-0.02em] text-white">Test checkout</h3>
            <p className="mt-1 text-[13px] leading-5 text-white/60">Assignment demo only — no real money will be charged.</p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-[0.08em] uppercase text-white/50">Plan</p>
                  <p className="text-sm font-semibold capitalize text-white mt-1">{testPlan}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-[0.08em] uppercase text-white/50">Amount</p>
                  <p className="text-sm font-bold text-white mt-1">{testPlan === "monthly" ? "£20/month" : "£200/year"}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1 border-white/15 bg-transparent text-white hover:bg-white/10" onClick={() => setTestPlan(null)} disabled={testLoading}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleTestCheckout} disabled={testLoading}>
                {testLoading ? "Processing..." : "Complete Test Payment"}
              </Button>
            </div>
            <p className="mt-3 text-center text-[11px] text-white/40">No card required • Test subscription activates immediately</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
