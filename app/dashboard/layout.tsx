import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav, DashboardMobileNav } from "@/components/dashboard/nav";

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
      {/* Living Orbit — subtle atmospheric background (behind all UI) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="living-light living-a" style={{ top: "-6%", right: "-4%" }} />
        <div className="living-light living-b" style={{ bottom: "-8%", left: "-2%" }} />
        {/* sparse constellation — 5 tiny points + hairlines */}
        <div className="absolute inset-0 opacity-[0.035]">
          <div className="absolute h-[2px] w-[2px] rounded-full bg-white" style={{ top: "18%", left: "22%" }} />
          <div className="absolute h-[1.5px] w-[1.5px] rounded-full bg-white" style={{ top: "32%", left: "78%" }} />
          <div className="absolute h-[2px] w-[2px] rounded-full bg-white" style={{ top: "64%", left: "14%" }} />
          <div className="absolute h-[1px] w-[1px] rounded-full bg-white" style={{ top: "72%", left: "68%" }} />
          <div className="absolute h-[1.5px] w-[1.5px] rounded-full bg-[#C8FF3D]" style={{ top: "48%", left: "52%", opacity: 0.5 }} />
          <div className="absolute h-px w-[68px] bg-[rgba(255,255,255,0.04)]" style={{ top: "18.5%", left: "22%", transform: "rotate(12deg)" }} />
          <div className="absolute h-px w-[42px] bg-[rgba(255,255,255,0.03)]" style={{ top: "64.2%", left: "14%", transform: "rotate(-8deg)" }} />
        </div>
        {/* orbital detail — 2 subtle curves */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden>
          <ellipse cx="620" cy="420" rx="520" ry="220" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <ellipse cx="620" cy="420" rx="380" ry="160" fill="none" stroke="rgba(200,255,61,0.04)" strokeWidth="1" strokeDasharray="6 10" />
        </svg>
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0C]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1160px] px-6 h-[60px] flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-7 w-7 rounded-lg bg-white text-[#0B0B0C] flex items-center justify-center text-xs font-bold">DH</div>
            <span className="font-semibold tracking-[-0.02em] text-[14px] text-white">Digital Heroes</span>
          </Link>

          <DashboardNav />
          <form
            action={async () => {
              "use server";
              const s = await createClient();
              if (s) await s.auth.signOut();
              redirect("/");
            }}
            className="shrink-0 ml-auto"
          >
            <button className="rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-white/15 transition-colors">
              Sign out
            </button>
          </form>
        </div>
        <DashboardMobileNav />
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1160px] px-6 py-8 flex-1">{children}</main>
    </div>
  );
}
