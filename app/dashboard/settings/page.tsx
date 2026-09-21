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
  const { toast } = useToast();
  const router = useRouter();
  const configured = isSupabaseConfigured();

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

  async function handleSubscribe(selected: "monthly" | "yearly") {
    if (!configured) {
      setPlan(selected);
      toast("Subscription preference updated", "info");
      return;
    }
    try {
      const res = await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ plan: selected }), headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.demo) {
        setPlan(selected);
        toast("Checkout unavailable — subscription updated locally", "info");
      } else {
        toast(data.message || "Checkout unavailable", "info");
      }
    } catch {
      toast("Checkout unavailable — please try again", "info");
    }
  }

  return (
    <div className="space-y-6 max-w-[640px]">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#74746F]">ACCOUNT</p>
        <h1 className="mt-1 text-[28px] md:text-[32px] font-bold tracking-[-0.02em] text-[#111113]">Settings</h1>
        <p className="mt-1 text-[14px] leading-6 text-[#5F5F5A]">Manage your profile and subscription.</p>
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
    </div>
  );
}
