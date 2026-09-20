import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { mockStats } from "@/lib/mock-data";

export default async function AdminOverview() {
  const supabase = await createClient();
  let stats = mockStats;
  const subGrowth = [{ month: "Jun", subs: 6200 }, { month: "Jul", subs: 7100 }, { month: "Aug", subs: 7800 }, { month: "Sep", subs: 8500 }, { month: "Oct", subs: 8921 }];
  if (supabase) {
    try {
      const { count: users } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: subs } = await supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active");
      if (users) stats = { ...stats, totalUsers: users };
      if (subs) stats = { ...stats, activeSubscribers: subs, prizePool: Math.round(subs * 10) };
    } catch {}
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <Card><p className="text-xs text-zinc-500 uppercase tracking-widest">Total users</p><p className="text-2xl font-bold mt-1">{stats.totalUsers.toLocaleString()}</p></Card>
        <Card><p className="text-xs text-zinc-500 uppercase tracking-widest">Active subscribers</p><p className="text-2xl font-bold mt-1">{stats.activeSubscribers.toLocaleString()}</p></Card>
        <Card><p className="text-xs text-zinc-500 uppercase tracking-widest">Prize pool</p><p className="text-2xl font-bold mt-1">£{stats.prizePool.toLocaleString()}</p></Card>
        <Card><p className="text-xs text-zinc-500 uppercase tracking-widest">Charity total</p><p className="text-2xl font-bold mt-1">£{stats.charityTotal.toLocaleString()}</p></Card>
      </div>
      <Card>
        <h3 className="font-semibold">Subscription growth</h3>
        <div className="mt-4 flex items-end gap-2 h-32">
          {subGrowth.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg bg-zinc-900 dark:bg-white" style={{ height: `${(d.subs / 9000) * 100}%`, minHeight: 8 }} />
              <span className="text-xs text-zinc-500">{d.month}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold">Quick actions</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <a href="/admin/draws" className="rounded-full border px-4 py-2">Configure draw</a>
          <a href="/admin/winners" className="rounded-full border px-4 py-2">Verify winners</a>
          <a href="/admin/charities" className="rounded-full border px-4 py-2">Manage charities</a>
        </div>
      </Card>
    </div>
  );
}
