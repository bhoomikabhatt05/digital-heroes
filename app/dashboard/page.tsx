import { Card, DarkCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { mockStats, mockCharities } from "@/lib/mock-data";
import { getNextDrawDate } from "@/lib/draw/engine";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="space-y-6">
      <DarkCard className="p-7 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#C8FF3D]/15 blur-3xl pointer-events-none" aria-hidden />
        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-white/60">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""} —</p>
          <h1 className="mt-2 text-[24px] md:text-[28px] font-bold tracking-[-0.02em] text-white">Your Hero dashboard</h1>
          <p className="mt-2 text-[13.5px] leading-6 text-white/60">
            Next draw: <span className="text-white font-medium">{nextDate}</span> • Prize pool <span className="text-white font-medium">£{prize.toLocaleString()}</span> • Jackpot{" "}
            <span className="text-white font-medium">{nextDraw?.jackpot_rollover ? `£${nextDraw.jackpot_rollover}` : "—"}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0 relative">
          <Link href="/dashboard/scores">
            <Button variant="secondary" className="h-10">Enter score</Button>
          </Link>
          <Link href="/dashboard/draws">
            <Button variant="outline" className="h-10 bg-white/10 border-white/20 text-white hover:bg-white/15 hover:text-white">
              View draw
            </Button>
          </Link>
        </div>
      </DarkCard>

      <div className="grid md:grid-cols-3 gap-5">
        <Card className="p-5">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5F5F5A]">Subscription</p>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant={subscription?.status === "active" ? "success" : "outline"}>{subscription?.status ?? "inactive (demo)"}</Badge>
            <span className="text-sm font-medium capitalize text-[#111113]">{subscription?.plan ?? "monthly"}</span>
          </div>
          <p className="text-xs leading-5 text-[#5F5F5A] mt-2">Renewal: {subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : "—"}</p>
          <Link href="/dashboard/settings" className="mt-3 inline-flex text-xs font-medium text-[#111113] hover:text-[#6B6B78]">
            Manage <span aria-hidden className="ml-1">→</span>
          </Link>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5F5F5A]">Performance</p>
          <p className="mt-3 text-[28px] font-bold tracking-[-0.02em] leading-none text-[#111113]">{avg}</p>
          <p className="text-xs text-[#5F5F5A] mt-1">Average of last {scores.length} scores</p>
          <div className="mt-3 flex gap-1.5 flex-wrap">
            {scores.length === 0 ? (
              <span className="text-xs text-[#5F5F5A]">No scores yet — add your first!</span>
            ) : (
              scores.slice(0, 5).map((s: any) => (
                <span key={s.id} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0B0B0C] text-white text-xs font-bold">
                  {s.score}
                </span>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5F5F5A]">Impact</p>
          <p className="mt-3 text-sm font-semibold tracking-[-0.01em] text-[#111113]">{selectedCharity?.name ?? "Choose a charity"}</p>
          <p className="text-xs text-[#5F5F5A] mt-1">{profile?.charity_percentage ?? 10}% of subscription</p>
          <div className="mt-3 h-2 rounded-full bg-[rgba(17,17,19,0.10)] overflow-hidden">
            <div className="h-full bg-[#C8FF3D]" style={{ width: `${Math.min(profile?.charity_percentage ?? 10, 100)}%` }} />
          </div>
          <Link href="/dashboard/charity" className="mt-3 inline-flex text-xs font-medium text-[#111113] hover:text-[#6B6B78]">
            Change charity <span aria-hidden className="ml-1">→</span>
          </Link>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">Latest scores</h3>
          {scores.length === 0 ? (
            <p className="text-[13.5px] text-[#5F5F5A] mt-2">No scores yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {scores.map((s: any, i: number) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-[rgba(17,17,19,0.10)] px-3.5 py-2.5 bg-white">
                  <span className="text-sm text-[#111113]">
                    {new Date(s.played_on).toLocaleDateString()} {i === 0 && <Badge variant="lime" className="ml-2">Latest</Badge>}
                  </span>
                  <span className="font-bold text-[#111113]">{s.score}</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/dashboard/scores" className="mt-4 inline-flex text-xs font-medium text-[#111113] hover:text-[#6B6B78]">
            Manage scores <span aria-hidden className="ml-1">→</span>
          </Link>
        </Card>

        <Card className="p-6">
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">Draw participation</h3>
          <p className="text-[13.5px] leading-6 text-[#6B6B78] mt-1">Your 5-number entry is auto-generated for each active draw.</p>
          <div className="mt-4 flex gap-2">
            {[7, 14, 23, 31, 42].map((n) => (
              <span key={n} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B0B0C] text-white text-sm font-bold">
                {n}
              </span>
            ))}
          </div>
          <p className="text-xs leading-5 text-[#5F5F5A] mt-3">
            Status: <Badge variant="outline" className="ml-1">{nextDraw?.status ?? "draft"}</Badge>{" "}
            <span className="ml-2">{nextDraw?.winning_numbers ? `Winning: ${nextDraw.winning_numbers.join(", ")}` : "Awaiting draw"}</span>
          </p>
        </Card>
      </div>
    </div>
  );
}
