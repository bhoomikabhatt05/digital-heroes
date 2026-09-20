import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function UsersPage() {
  const supabase = await createClient();
  let users: any[] = [];
  if (supabase) {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50);
    if (data) users = data;
  }
  if (!users.length) {
    users = [
      { id: "1", full_name: "Alex Morgan", email: "alex@example.com", role: "user", charity_percentage: 15, created_at: new Date().toISOString() },
      { id: "2", full_name: "Jordan Lee", email: "jordan@example.com", role: "admin", charity_percentage: 20, created_at: new Date().toISOString() },
      { id: "3", full_name: "Sam Rivera", email: "sam@example.com", role: "user", charity_percentage: 10, created_at: new Date().toISOString() },
    ];
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="overflow-x-auto">
        <Card className="p-0 overflow-hidden min-w-[600px]">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="p-3">Role</th><th className="p-3">Charity %</th></tr></thead>
            <tbody>{users.map((u) => <tr key={u.id} className="border-t dark:border-zinc-800"><td className="p-3 font-medium">{u.full_name ?? "—"}</td><td className="p-3 text-zinc-500">{u.email}</td><td className="p-3 text-center"><Badge variant={u.role === "admin" ? "lime" : "outline"}>{u.role}</Badge></td><td className="p-3 text-center">{u.charity_percentage}%</td></tr>)}</tbody>
          </table>
        </Card>
      </div>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {users.map((u) => <Card key={u.id}><p className="font-medium">{u.full_name}</p><p className="text-sm text-zinc-500">{u.email}</p><div className="mt-2 flex gap-2"><Badge>{u.role}</Badge><Badge variant="outline">{u.charity_percentage}%</Badge></div></Card>)}
      </div>
    </div>
  );
}
