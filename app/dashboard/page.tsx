/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { mockStats, mockCharities } from "@/lib/mock-data";
import { getNextDrawDate } from "@/lib/draw/engine";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScoreOrbit } from "@/components/art/impact-orbit";

export default async function DashboardPage() {
  const supabase = await createClient();
  let profile: any = null;
  let scores: any[] = [];
  let subscription: any = null;
  let nextDraw: any = null;
  let charities: any[] = mockCharities;

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      profile = p;
      const { data: sc } = await supabase.from("scores").select("*").eq("user_id", user.id).order("played_on", { ascending: false }).limit(5);
      if (sc) scores = sc;
      const { data: sub } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      subscription = sub;
      const { data: draw } = await supabase.from("draws").select("*").order("draw_date", { ascending: false }).limit(1).maybeSingle();
      nextDraw = draw;
      const { data: ch } = await supabase.from("charities").select("*").eq("active", true).limit(3);
      if (ch?.length) charities = ch;
    }
  }

  const avg = scores.length ? (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1) : "—";
  const nextDate = nextDraw?.draw_date ? new Date(nextDraw.draw_date).toLocaleDateString() : getNextDrawDate().toLocaleDateString();
  const prize = nextDraw?.prize_pool ?? mockStats.prizePool;
  const selectedCharity = charities.find((c) => c.id === profile?.charity_id) ?? charities[0];
  const scoreValues = scores.map((s: any) => s.score);
  const isSubscribed = subscription?.status === "active";

  return (
    <div className="space-y-6">
      {/* Command Center Header — user personal */}
      <div className="rounded-3xl border border-white/10 bg-[#0B0B0C] text-white p-6 md:p-7 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "48px 48px" }} aria-hidden />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C8FF3D]/10 blur-3xl" aria-hidden />
        <p className="relative text-[11px] font-semibold tracking-[0.12em] uppercase text-[#A5A5A0] flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C8FF3D] shadow-[0_0_8px_rgba(200,255,61,0.7)] animate-pulse" />
          GOOD EVENING, HERO.
        </p>
        <h1 className="relative mt-2 text-[22px] md:text-[26px] font-bold tracking-[-0.02em] text-white">YOUR HERO SYSTEM</h1>

        <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-white/10 bg-[#131518] p-4">
            <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Subscription</p>
            <p className="mt-1 text-sm font-bold text-white flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isSubscribed ? "bg-[#C8FF3D] shadow-[0_0_8px_rgba(200,255,61,0.5)]" : "bg-[#FF8A5B]"}`} />
              {isSubscribed ? "ACTIVE" : "INACTIVE"}
            </p>
            <p className="text-xs text-[#A5A5A0] mt-1">{isSubscribed ? (subscription?.plan ?? "monthly") : "Choose a plan →"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#131518] p-4">
            <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Next draw</p>
            <p className="mt-1 text-sm font-bold text-white">{nextDate}</p>
            <p className="text-xs text-[#A5A5A0] mt-1">£{prize.toLocaleString()} pool</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#131518] p-4">
            <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Charity</p>
            <p className="mt-1 text-sm font-bold text-white truncate">{selectedCharity?.name ?? "Choose"}</p>
            <p className="text-xs text-[#61E7FF] mt-1">Verified impact</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#131518] p-4">
            <p className="text-[11px] tracking-[0.08em] uppercase text-[#A5A5A0]">Contribution</p>
            <p className="mt-1 text-[20px] font-black tracking-[-0.02em] text-white">{profile?.charity_percentage ?? 10}%</p>
            <p className="text-xs text-[#A5A5A0] mt-1">of subscription <span className="text-[#C8FF3D]">•</span> £{((20 * (profile?.charity_percentage ?? 10)) / 100).toFixed(2)}/mo</p>
          </div>
        </div>

        <div className="relative mt-5 flex gap-3">
          <Link href="/dashboard/scores"><Button className="h-9">Enter score →</Button></Link>
          <Link href="/dashboard/draws"><Button variant="secondary" className="h-9 border-white/15">View draw</Button></Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
        {/* Score Orbit Signature */}
        <div className="space-y-5">
          <ScoreOrbit scores={scoreValues} />
          <Card className="p-5 bg-[#0B0B0C] border-white/10 text-white">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#A5A5A0]">Performance</p>
            <p className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-white">{avg}</p>
            <p className="text-xs text-[#74746F]">Average of last {scores.length} scores • Stableford 1–45</p>
            <div className="mt-4 space-y-2">
              {scores.length === 0 ? (
                <p className="text-sm text-[#A5A5A0]">No scores yet — add your first to light the orbit.</p>
              ) : (
                scores.map((s: any, i: number) => (
                  <div key={s.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#131518] px-3 py-2">
                    <span className="text-sm text-white">{new Date(s.played_on).toLocaleDateString()} {i === 0 && <Badge variant="lime" className="ml-2">Latest</Badge>}</span>
                    <span className="font-bold text-white">{s.score}</span>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/scores" className="mt-3 inline-flex text-xs font-medium text-[#C8FF3D] hover:text-white">Manage scores →</Link>
          </Card>
        </div>

        {/* Right column: Impact + Draw */}
        <div className="space-y-5">
          <Card className="p-5">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#74746F]">Impact</p>
            <p className="mt-2 text-[16px] font-semibold tracking-[-0.01em] text-[#111113]">{selectedCharity?.name}</p>
            <p className="text-xs text-[#5F5F5A] mt-1">{profile?.charity_percentage ?? 10}% of subscription → £{((20 * (profile?.charity_percentage ?? 10)) / 100).toFixed(2)}/mo</p>
            <div className="mt-3 h-2 rounded-full bg-[rgba(17,17,19,0.08)] overflow-hidden">
              <div className="h-full bg-[#C8FF3D]" style={{ width: `${Math.min(profile?.charity_percentage ?? 10, 100)}%` }} />
            </div>
            <Link href="/dashboard/charity" className="mt-3 inline-flex text-xs font-medium text-[#111113] hover:text-[#5F5F5A]">Adjust contribution →</Link>
          </Card>

          <Card className="p-5 bg-[#131518] border-white/10 text-white premium-card-dark">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#A5A5A0]">Draw participation</p>
            <p className="mt-2 text-[13.5px] leading-6 text-[#A5A5A0]">Your 5-number entry is auto-generated for each active draw.</p>
            <div className="mt-4 flex gap-2">
              {[7, 14, 23, 31, 42].map((n) => (
                <span key={n} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0B0B0C] text-sm font-bold shadow-sm">{n}</span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium text-white">{(nextDraw?.status ?? "draft").toUpperCase()}</span>
              <span className="text-xs font-medium text-[#A5A5A0]">{nextDraw?.winning_numbers ? `Winning: ${nextDraw.winning_numbers.join(", ")}` : "Awaiting draw"}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
