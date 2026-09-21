import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/scores", label: "Scores" },
  { href: "/dashboard/draws", label: "Draws" },
  { href: "/dashboard/charity", label: "Charity" },
  { href: "/dashboard/winnings", label: "Winnings" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const isConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
      if (isConfigured) redirect("/login");
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0C] text-white relative overflow-hidden">
      {/* Ambient live canvas — behind all UI */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="ambient-layer ambient-1" style={{ top: "-8%", right: "-6%" }} />
        <div className="ambient-layer ambient-2" style={{ bottom: "-10%", left: "-4%" }} />
        <div className="ambient-layer ambient-3" style={{ top: "28%", left: "18%" }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0C]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1160px] px-6 h-[60px] flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-7 w-7 rounded-lg bg-white text-[#0B0B0C] flex items-center justify-center text-xs font-bold">DH</div>
            <span className="font-semibold tracking-[-0.02em] text-[14px] text-white">Digital Heroes</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-[13.5px]">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-3 py-1.5 font-medium text-[#A5A5A0] hover:text-white hover:bg-white/10 transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <form
            action={async () => {
              "use server";
              const s = await createClient();
              if (s) await s.auth.signOut();
              redirect("/");
            }}
            className="shrink-0"
          >
            <button className="rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-white/15 transition-colors">
              Sign out
            </button>
          </form>
        </div>

        <div className="md:hidden border-t border-white/10 overflow-x-auto">
          <div className="flex gap-1 px-6 py-2 text-sm whitespace-nowrap">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-full px-3 py-1.5 font-medium text-[#A5A5A0] hover:text-white">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1160px] px-6 py-8 flex-1">{children}</main>
    </div>
  );
}
