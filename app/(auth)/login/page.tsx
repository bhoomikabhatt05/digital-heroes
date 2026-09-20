"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#F7F7F3] dark:bg-[#0A0A0B]">
      <Card className="w-full max-w-[440px] p-7 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#111113] flex items-center justify-center text-white text-xs font-bold">DH</div>
          <span className="text-sm font-semibold tracking-[-0.02em] text-[#111113]">Digital Heroes</span>
        </div>
        <h1 className="mt-6 text-[22px] font-bold tracking-[-0.02em] text-[#111113]">Welcome back</h1>
        <p className="mt-1.5 text-[13.5px] leading-6 text-[#6B6B78]">Sign in to your Digital Heroes account.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 mt-2">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-[13.5px] text-center mt-6 text-[#6B6B78]">
          No account? <Link href="/signup" className="font-medium text-[#111113] hover:text-[#6B6B78] underline underline-offset-4">Create one</Link>
        </p>
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-medium text-amber-800">Demo mode</p>
          <p className="text-xs leading-5 text-amber-700 mt-1">Without Supabase env vars, login redirects to dashboard automatically.</p>
        </div>
      </Card>
    </div>
  );
}
