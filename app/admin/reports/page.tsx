import { Card } from "@/components/ui/card";
import { mockStats } from "@/lib/mock-data";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card><p className="text-xs text-zinc-500 uppercase tracking-widest">Total users</p><p className="text-2xl font-bold mt-1">{mockStats.totalUsers.toLocaleString()}</p></Card>
        <Card><p className="text-xs text-zinc-500 uppercase tracking-widest">Prize pool (all time)</p><p className="text-2xl font-bold mt-1">£{(mockStats.prizePool * 6).toLocaleString()}</p></Card>
        <Card><p className="text-xs text-zinc-500 uppercase tracking-widest">Charity contributions</p><p className="text-2xl font-bold mt-1">£{mockStats.charityTotal.toLocaleString()}</p></Card>
      </div>
      <Card>
        <h3 className="font-semibold">Draw statistics</h3>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between border-b py-2 dark:border-zinc-800"><span>Total draws</span><span className="font-medium">12</span></div>
          <div className="flex justify-between border-b py-2 dark:border-zinc-800"><span>Published</span><span className="font-medium">9</span></div>
          <div className="flex justify-between border-b py-2 dark:border-zinc-800"><span>Jackpot rollovers</span><span className="font-medium">2</span></div>
          <div className="flex justify-between py-2"><span>Total winners</span><span className="font-medium">47</span></div>
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold">Charity breakdown</h3>
        <div className="mt-4 space-y-2 text-sm">
          {["Ocean Guardians", "Future Greens", "Youth Swing"].map((n, i) => (
            <div key={n} className="flex justify-between"><span>{n}</span><span className="font-medium">£{((i + 1) * 12000).toLocaleString()}</span></div>
          ))}
        </div>
      </Card>
    </div>
  );
}
