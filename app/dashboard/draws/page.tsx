/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockStats } from "@/lib/mock-data";

export default async function DrawsPage() {
  const supabase = await createClient();
  let draws: any[] = [];
  let entries: any[] = [];
  if (supabase) {
    const { data: d } = await supabase.from("draws").select("*").order("draw_date", { ascending: false });
    if (d) draws = d;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: e } = await supabase.from("draw_entries").select("*").eq("user_id", user.id);
      if (e) entries = e;
    }
  }
  if (!draws.length) {
    draws = [{ id: "demo", draw_date: "2026-10-15T12:00:00.000Z", status: "draft", draw_type: "random", winning_numbers: null, prize_pool: mockStats.prizePool, jackpot_rollover: 12400 }];
  }

  const nextDraw = draws[0];
  // eslint-disable-next-line react-hooks/purity
  const daysLeft = Math.max(0, Math.ceil((new Date(nextDraw.draw_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6 max-w-[880px]">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#74746F]">MONTHLY EVENT — DRAW SYSTEM</p>
        <h1 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-[#111113]">Draws</h1>
      </div>

      {/* Next draw hero event */}
      <div className="rounded-3xl border border-white/10 bg-[#0B0B0C] text-white p-6 md:p-7 overflow-hidden relative">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C8FF3D]/10 blur-3xl" aria-hidden />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} aria-hidden />
        <div className="relative grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] tracking-[0.08em] uppercase text-[#A5A5A0]">NEXT DRAW</p>
            <div className="mt-3 flex gap-3">
              <div className="rounded-2xl bg-[#131518] border border-white/10 px-4 py-3 text-center min-w-[72px]">
                <p className="text-[28px] font-black tracking-[-0.02em] text-white">{String(daysLeft).padStart(2, "0")}</p>
                <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Days</p>
              </div>
              <div className="rounded-2xl bg-[#131518] border border-white/10 px-4 py-3 text-center min-w-[56px]">
                <p className="text-[20px] font-bold text-white">04</p>
                <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Hours</p>
              </div>
              <div className="rounded-2xl bg-[#131518] border border-white/10 px-4 py-3 text-center min-w-[56px]">
                <p className="text-[20px] font-bold text-white">32</p>
                <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Mins</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2 text-[11px]">
              <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#0B0B0C]">5 MATCH — 40%</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white border border-white/10">4 MATCH — 35%</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white border border-white/10">3 MATCH — 25%</span>
            </div>
          </div>
          <div className="relative flex flex-col justify-center">
            <p className="text-[11px] tracking-[0.08em] uppercase text-[#A5A5A0]">PRIZE POOL</p>
            <p className="mt-1 text-[36px] font-black tracking-[-0.03em] text-white">£{mockStats.prizePool.toLocaleString()}</p>
            {nextDraw.jackpot_rollover ? (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#FF8A5B]/15 border border-[#FF8A5B]/20 px-3 py-1.5 text-xs font-medium text-[#FF8A5B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A5B] animate-pulse" />
                Jackpot rollover £{nextDraw.jackpot_rollover.toLocaleString()} — rolls if no 5-match
              </div>
            ) : (
              <p className="text-xs text-[#74746F] mt-1">No rollover • Prize pool shared equally within tier</p>
            )}
            <div className="mt-4 h-px bg-white/10" />
            <p className="mt-3 text-xs text-[#A5A5A0]">Trustworthy distribution • Multiple winners split tier equally • Verified after draw</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {draws.map((d) => {
          const entry = entries.find((e) => e.draw_id === d.id);
          const statusVariant = d.status === "published" ? "success" : d.status === "simulated" ? "warning" : "outline";
          return (
            <Card key={d.id} className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold tracking-[-0.01em] text-[#111113]">
                    {new Date(d.draw_date).toLocaleDateString()} <Badge variant={statusVariant as any} className="ml-2">{d.status}</Badge>
                  </p>
                  <p className="mt-1 text-[13.5px] text-[#5F5F5A]">
                    {d.draw_type} • Prize <span className="font-medium text-[#111113]">£{d.prize_pool?.toLocaleString()}</span>
                    {d.jackpot_rollover ? <span className="text-[#FF8A5B]"> + £{d.jackpot_rollover.toLocaleString()} rollover</span> : ""}
                  </p>
                </div>
                <Badge variant="lime" className="text-xs">{d.winning_numbers ? d.winning_numbers.join(" • ") : "Awaiting numbers"}</Badge>
              </div>
              <div className="mt-5 flex gap-2">
                {(entry?.numbers ?? [7, 14, 23, 31, 42]).map((n: number) => (
                  <span key={n} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B0B0C] text-white text-sm font-bold">
                    {n}
                  </span>
                ))}
              </div>
              <p className="text-xs leading-5 text-[#5F5F5A] mt-3">
                Your entry: {entry ? entry.numbers.join(", ") : "Auto-generated for active subscribers"} • Winners split tiers equally.
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
