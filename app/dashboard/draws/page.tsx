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
    draws = [{ id: "demo", draw_date: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(), status: "draft", draw_type: "random", winning_numbers: null, prize_pool: mockStats.prizePool, jackpot_rollover: 12400 }];
  }

  return (
    <div className="space-y-6 max-w-[880px]">
      <div>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[#111113]">Draws</h1>
        <p className="mt-1 text-[13.5px] leading-6 text-[#6B6B78]">Monthly draw — 5 numbers • Match 3/4/5 to win. Prize pool shared by tier.</p>
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
                  <p className="mt-1 text-[13.5px] text-[#6B6B78]">
                    {d.draw_type} • Prize <span className="font-medium text-[#111113]">£{d.prize_pool?.toLocaleString()}</span>
                    {d.jackpot_rollover ? <span className="text-[#5F5F5A]"> + £{d.jackpot_rollover.toLocaleString()} rollover</span> : ""}
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
                Your entry: {entry ? entry.numbers.join(", ") : "Auto-generated for active subscribers"} • Winners split tiers equally. Jackpot rolls over if no 5-match.
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
