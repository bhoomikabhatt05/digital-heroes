import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/draws", label: "Draws" },
  { href: "/admin/charities", label: "Charities" },
  { href: "/admin/winners", label: "Winners" },
  { href: "/admin/reports", label: "Reports" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") redirect("/dashboard");
  }
  return (
    <div className="min-h-screen flex">
      <aside className="w-[220px] border-r border-white/10 bg-[#0B0B0C] text-white p-6 hidden md:flex md:flex-col">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-white text-[#111113] flex items-center justify-center text-xs font-bold">DH</div>
          <span className="font-semibold tracking-[-0.02em] text-sm">Admin</span>
          <span className="text-xs text-white/50">• Digital Heroes</span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1 text-[13.5px]">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/dashboard" className="mt-auto pt-6 text-xs font-medium text-white/50 hover:text-white">
          ← Back to dashboard
        </Link>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden border-b border-[rgba(17,17,19,0.10)] bg-white px-6 py-3 flex gap-2 overflow-x-auto text-sm dark:border-white/10 dark:bg-[#0B0B0C]">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-full border border-[rgba(17,17,19,0.10)] px-3 py-1.5 text-[#111113] dark:border-white/15 dark:text-white">
              {n.label}
            </Link>
          ))}
        </header>
        <main className="p-6 md:p-8 flex-1 bg-[#F4F4F1] dark:bg-[#0A0A0B]">{children}</main>
      </div>
    </div>
  );
}
