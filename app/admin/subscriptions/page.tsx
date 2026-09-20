/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SubsPage() {
  const supabase = await createClient();
  let subs: any[] = [];
  if (supabase) {
    const { data } = await supabase.from("subscriptions").select("*").order("created_at", { ascending: false }).limit(50);
    if (data) subs = data;
  }
  if (!subs.length) subs = [
    { id: "s1", user_id: "1", plan: "monthly", status: "active", current_period_end: "2026-10-20T12:00:00.000Z" },
    { id: "s2", user_id: "2", plan: "yearly", status: "active", current_period_end: "2027-04-15T12:00:00.000Z" },
    { id: "s3", user_id: "3", plan: "monthly", status: "past_due", current_period_end: new Date().toISOString() },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscriptions</h1>
      <div className="overflow-x-auto">
        <Card className="p-0 overflow-hidden min-w-[600px]">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500"><tr><th className="p-3 text-left">Plan</th><th className="p-3">Status</th><th className="p-3">Renewal</th></tr></thead>
            <tbody>{subs.map((s) => <tr key={s.id} className="border-t dark:border-zinc-800"><td className="p-3 capitalize">{s.plan}</td><td className="p-3 text-center"><Badge variant={s.status === "active" ? "success" : s.status === "past_due" ? "warning" : "outline"}>{s.status}</Badge></td><td className="p-3 text-center">{s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}</td></tr>)}</tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
