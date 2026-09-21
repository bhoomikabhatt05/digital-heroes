import Link from "next/link";
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
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5F5F5A]">ADMIN CONTROL CENTER</p>
        <h1 className="mt-1 text-[28px] md:text-[32px] font-bold tracking-[-0.02em] text-[#111113]">Operational Overview</h1>
        <p className="mt-1 text-[14px] leading-6 text-[#5F5F5A]">Monitor users, subscriptions, draws and impact in real time.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="premium-card"><p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5F5F5A]">Total users</p><p className="text-2xl font-bold mt-2 text-[#111113]">{stats.totalUsers.toLocaleString()}</p><p className="text-xs text-[#74746F] mt-1">All registered heroes</p></Card>
        <Card className="premium-card"><p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5F5F5A]">Active subscriptions</p><p className="text-2xl font-bold mt-2 text-[#111113]">{stats.activeSubscribers.toLocaleString()}</p><p className="text-xs text-[#74746F] mt-1">Monthly + yearly</p></Card>
        <Card className="premium-card border-[#C8FF3D]/20"><p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5F5F5A]">Current prize pool</p><p className="text-2xl font-bold mt-2 text-[#111113]">£{stats.prizePool.toLocaleString()}</p><p className="text-xs text-[#C8FF3D] mt-1 font-medium">Next draw in 18 days</p></Card>
        <Card className="premium-card"><p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5F5F5A]">Charity contributions</p><p className="text-2xl font-bold mt-2 text-[#111113]">£{stats.charityTotal.toLocaleString()}</p><p className="text-xs text-[#74746F] mt-1">Total impact to date</p></Card>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="premium-card"><p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#FF8A5B]">Pending verifications</p><p className="text-2xl font-bold mt-2">3</p><p className="text-xs text-[#5F5F5A] mt-1">Winner proofs awaiting review</p><Link href="/admin/winners" className="mt-3 inline-flex text-xs font-medium text-[#111113] hover:text-[#C8FF3D]">Review →</Link></Card>
        <Card className="premium-card"><p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#61E7FF]">Upcoming draw</p><p className="text-lg font-bold mt-2">Draw #12 • Draft</p><p className="text-xs text-[#5F5F5A] mt-1">152 entries • Simulation ready</p><Link href="/admin/draws" className="mt-3 inline-flex text-xs font-medium text-[#111113] hover:text-[#C8FF3D]">Configure →</Link></Card>
        <Card className="premium-card"><p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9B8CFF]">Charity impact</p><p className="text-lg font-bold mt-2">6 active causes</p><p className="text-xs text-[#5F5F5A] mt-1">Featured: Ocean Guardians</p><Link href="/admin/charities" className="mt-3 inline-flex text-xs font-medium text-[#111113] hover:text-[#C8FF3D]">Manage →</Link></Card>
      </div>
      <Card>
        <h3 className="font-semibold">Subscription growth</h3>
        <div className="mt-4 flex items-end gap-2 h-32">
          {subGrowth.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg bg-[#0B0B0C]" style={{ height: `${(d.subs / 9000) * 100}%`, minHeight: 8 }} />
              <span className="text-xs text-[#5F5F5A]">{d.month}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="premium-card">
        <h3 className="font-semibold">Quick actions</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/admin/draws" className="rounded-full border border-[rgba(17,17,19,0.10)] px-4 py-2 hover:border-[#C8FF3D]/30 hover:bg-[#C8FF3D]/10 transition-colors">Configure draw</Link>
          <Link href="/admin/winners" className="rounded-full border border-[rgba(17,17,19,0.10)] px-4 py-2 hover:border-[#C8FF3D]/30 hover:bg-[#C8FF3D]/10 transition-colors">Verify winners</Link>
          <Link href="/admin/charities" className="rounded-full border border-[rgba(17,17,19,0.10)] px-4 py-2 hover:border-[#C8FF3D]/30 hover:bg-[#C8FF3D]/10 transition-colors">Manage charities</Link>
        </div>
      </Card>
    </div>
  );
}
