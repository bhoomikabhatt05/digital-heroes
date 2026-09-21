"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [status, setStatus] = useState("active");
  const [testPlan, setTestPlan] = useState<"monthly" | "yearly" | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const configured = isSupabaseConfigured();

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
      setPlan(testPlan);
      setStatus("active");
      setTestPlan(null);
    } catch {
      toast("Test payment failed. Please try again.", "error");
    }
    setTestLoading(false);
  }

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? "");
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
        if (profile) setName(profile.full_name ?? "");
        const { data: sub } = await supabase.from("subscriptions").select("plan,status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (sub) {
          setPlan(sub.plan);
          setStatus(sub.status);
        }
      }
    })();
  }, [configured]);

  async function saveProfile() {
    if (!configured) {
      toast("Profile updated", "success");
      return;
    }
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    if (error) toast(error.message, "error");
    else toast("Profile updated", "success");
  }

  function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  }

  async function handleSubscribe(selected: "monthly" | "yearly") {
    if (!configured) {
      toast("Online payment is currently unavailable. Please try again later.", "info");
      return;
    }
    try {
      const orderRes = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        if (orderRes.status === 503 || orderData.error?.toLowerCase().includes("unavailable")) {
          setTestPlan(selected);
          return;
        }
        toast(orderData.error || "Online payment is currently unavailable. Please try again later.", "info");
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast("Online payment is currently unavailable. Please try again later.", "info");
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase.from("profiles").select("full_name,email").eq("id", user.id).single() : { data: null };

      const options: Record<string, unknown> = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Digital Heroes",
        description: selected === "monthly" ? "Monthly — £20/month" : "Yearly — £200/year",
        order_id: orderData.order_id,
        prefill: {
          name: (profile as unknown as { full_name?: string })?.full_name || (user as unknown as { user_metadata?: { full_name?: string } })?.user_metadata?.full_name || "",
          email: (profile as unknown as { email?: string })?.email || user?.email || "",
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
                plan: selected,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              toast(verifyData.error || "Payment verification failed.", "error");
              return;
            }
            setPlan(selected);
            setStatus("active");
            toast("Payment verified — subscription active!", "success");
          } catch {
            toast("Payment verification failed. Please contact support.", "error");
          }
        },
        modal: {
          ondismiss: function () {
            toast("Checkout cancelled — subscription not activated.", "info");
          },
        },
      };

      const rzp = new (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void; on: (ev: string, cb: () => void) => void } }).Razorpay(options);
      rzp.on("payment.failed", function () {
        toast("Payment failed — subscription not activated.", "error");
      });
      rzp.open();
    } catch {
      toast("Online payment is currently unavailable. Please try again later.", "info");
    }
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#A5A5A0]">ACCOUNT</p>
        <h1 className="mt-1 text-[28px] md:text-[32px] font-bold tracking-[-0.02em] text-white">Settings</h1>
        <p className="mt-1 text-[14px] leading-6 text-[#A5A5A0]">Manage your profile and subscription.</p>
      </div>

      <Card className="p-6">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">Profile</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" autoComplete="name" className="h-11" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="h-11 bg-[#F4F4F1] text-[#111113] border-[rgba(17,17,19,0.10)] truncate" title={email} />
          </div>
          <Button onClick={saveProfile} className="h-11 btn-lift">Save changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">Subscription</h3>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant={status === "active" ? "success" : "outline"}>{status}</Badge>
          <span className="text-sm font-medium capitalize text-[#111113]">{plan}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSubscribe("monthly")}
            aria-pressed={plan === "monthly"}
            className={`rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111113] ${plan === "monthly" ? "border-[#111113] bg-[#0B0B0C] text-white" : "border-[rgba(17,17,19,0.10)] bg-white hover:border-[#D1D1CC]"}`}
          >
            <p className={`text-sm font-semibold ${plan === "monthly" ? "text-white" : "text-[#111113]"}`}>Monthly</p>
            <p className={`text-sm mt-1 ${plan === "monthly" ? "text-white/60" : "text-[#6B6B78]"}`}>£20/mo</p>
          </button>
          <button
            onClick={() => handleSubscribe("yearly")}
            aria-pressed={plan === "yearly"}
            className={`rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111113] ${plan === "yearly" ? "border-[#111113] bg-[#0B0B0C] text-white" : "border-[rgba(17,17,19,0.10)] bg-white hover:border-[#D1D1CC]"}`}
          >
            <p className={`text-sm font-semibold ${plan === "yearly" ? "text-white" : "text-[#111113]"}`}>Yearly</p>
            <p className={`text-sm mt-1 ${plan === "yearly" ? "text-white/60" : "text-[#6B6B78]"}`}>£200/yr • Save 17%</p>
          </button>
        </div>
        <p className="text-xs leading-5 text-[#5F5F5A] mt-3">
          {status === "active" ? "Subscription renews automatically. Manage or cancel anytime." : "Choose a plan to activate your subscription and enter draws."}
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">Account</h3>
        <p className="mt-1 text-[13.5px] leading-6 text-[#6B6B78]">Sign out of Digital Heroes on this device.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/");
          }}
        >
          Sign out
        </Button>
      </Card>

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
    </div>
  );
}
