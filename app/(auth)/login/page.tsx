"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { DarkInput, DarkLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DarkCard } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      toast("Supabase not configured — demo mode. Redirecting to dashboard.", "info");
      router.push("/dashboard");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast(error.message, "error");
      return;
    }
    toast("Welcome back!", "success");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0B0B0C]">
      <DarkCard className="w-full max-w-[440px] p-7 md:p-8 border-white/10 bg-[#171719]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-[10px] bg-white text-[#0B0B0C] flex items-center justify-center text-xs font-bold">DH</div>
          <span className="text-sm font-semibold tracking-[-0.02em] text-white">Digital Heroes</span>
        </div>
        <h1 className="mt-6 text-[22px] font-bold tracking-[-0.02em] text-[#F5F5F2]">Welcome back</h1>
        <p className="mt-1.5 text-[13.5px] leading-6 text-[#A5A5A0]">Sign in to your Digital Heroes account.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <DarkLabel htmlFor="email">Email</DarkLabel>
            <DarkInput id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <DarkLabel htmlFor="password">Password</DarkLabel>
            <DarkInput id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 mt-2">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-[13.5px] text-center mt-6 text-[#A5A5A0]">
          No account? <Link href="/signup" className="font-medium text-white hover:text-[#C8FF3D] underline underline-offset-4">Create one</Link>
        </p>
        <div className="mt-6 rounded-[12px] border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs font-semibold tracking-wide uppercase text-[#C8FF3D]">Demo mode</p>
          <p className="text-xs leading-5 text-[#A5A5A0] mt-1">Without Supabase env vars, login redirects to dashboard automatically.</p>
        </div>
      </DarkCard>
    </div>
  );
}
