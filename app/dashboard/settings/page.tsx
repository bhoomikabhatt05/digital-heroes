"use client";
import { useEffect, useState } from "react";
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
      toast("Saved (demo)", "success");
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
      toast("Plan updated (demo) — Stripe not configured", "info");
      return;
    }
    toast("Redirecting to Stripe checkout (test mode)...", "info");
    try {
      const res = await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ plan: selected }), headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else {
        setPlan(selected);
        toast("Stripe demo: plan updated locally", "success");
      }
    } catch {
      setPlan(selected);
    }
  }

  return (
    <div className="space-y-6 max-w-[640px]">
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[#111113]">Settings</h1>

      <Card className="p-6">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">Profile</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" autoComplete="name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="bg-[#F7F7F3] text-[#6B6B78]" />
          </div>
          <Button onClick={saveProfile} className="h-10">Save profile</Button>
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
            className={`rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111113] ${plan === "monthly" ? "border-[#111113] bg-[#111113] text-white" : "border-[#E8E8E3] bg-white hover:border-[#D1D1CC]"}`}
          >
            <p className={`text-sm font-semibold ${plan === "monthly" ? "text-white" : "text-[#111113]"}`}>Monthly</p>
            <p className={`text-sm mt-1 ${plan === "monthly" ? "text-white/60" : "text-[#6B6B78]"}`}>£20/mo</p>
          </button>
          <button
            onClick={() => handleSubscribe("yearly")}
            aria-pressed={plan === "yearly"}
            className={`rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111113] ${plan === "yearly" ? "border-[#111113] bg-[#111113] text-white" : "border-[#E8E8E3] bg-white hover:border-[#D1D1CC]"}`}
          >
            <p className={`text-sm font-semibold ${plan === "yearly" ? "text-white" : "text-[#111113]"}`}>Yearly</p>
            <p className={`text-sm mt-1 ${plan === "yearly" ? "text-white/60" : "text-[#6B6B78]"}`}>£200/yr • Save 17%</p>
          </button>
        </div>
        <p className="text-xs leading-5 text-[#8D8D98] mt-3">Stripe test mode: use <span className="font-mono text-[#111113]">4242 4242 4242 4242</span>. Graceful demo if env missing.</p>
      </Card>
    </div>
  );
}
