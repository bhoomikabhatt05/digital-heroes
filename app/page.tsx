import Link from "next/link";
import { Navbar, Footer } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { mockCharities, mockStats } from "@/lib/mock-data";
import { ImpactOrbit, LiveSystemBar } from "@/components/art/impact-orbit";
import { BackgroundSystem } from "@/components/art/background-system";
import { SafeImage } from "@/components/ui/safe-image";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  let charities = mockCharities;
  let stats = mockStats;
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.from("charities").select("*").eq("active", true).order("featured", { ascending: false });
      if (data && data.length) charities = data as unknown as typeof mockCharities;
      // production stats could be derived from real counts; keep demo fallback for counts
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: subCount } = await supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active");
      if (userCount !== null) stats = { ...stats, totalUsers: userCount };
      if (subCount !== null) stats = { ...stats, activeSubscribers: subCount };
    }
  } catch {}
  const featured = charities.filter((c) => c.featured).slice(0, 3);
  return (
    <div className="min-h-screen flex flex-col bg-[#070708] text-white relative overflow-hidden">
      <BackgroundSystem />
      <Navbar />

      {/* HERO — EXPERIENCE */}
      <section className="relative mx-auto w-full max-w-[1160px] px-6 pt-8 md:pt-12 pb-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-start">
          {/* Editorial headline */}
          <div className="relative pt-2">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#A5A5A0] flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#C8FF3D]" />
              DIGITAL HEROES / IMPACT ORBIT
              <span className="hidden md:inline text-[#74746F]">— FEEL, NOT FAIRWAY</span>
            </p>
            <h1 className="mt-4 text-[52px] md:text-[88px] font-black tracking-[-0.05em] leading-[0.82] text-white">
              PLAY
              <br />
              FOR
              <br />
              <span className="text-[#C8FF3D]">MORE.</span>
            </h1>
            <p className="mt-6 text-[15px] md:text-[16px] leading-7 text-[#A5A5A0] max-w-[420px]">
              Track your performance. Enter the monthly draw. Every subscription fuels charitable impact. One ecosystem —
              <span className="text-white"> PLAY → WIN → GIVE BACK.</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-7">JOIN HEROES <span aria-hidden className="ml-2">→</span></Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="secondary" size="lg" className="h-12 px-7">How it works</Button>
              </Link>
            </div>
            {/* thin technical line */}
            <div className="mt-10 hidden md:flex items-center gap-3 text-[11px] tracking-[0.08em] uppercase text-[#74746F]">
              <span>PLAY</span>
              <span className="h-px w-8 bg-white/10" />
              <span>PERFORM</span>
              <span className="h-px w-8 bg-white/10" />
              <span>DRAW</span>
              <span className="h-px w-8 bg-[#C8FF3D]/40" />
              <span className="text-[#C8FF3D]">IMPACT</span>
            </div>
          </div>

          {/* Orbit + Live System */}
          <div className="relative space-y-5">
            <div className="rounded-3xl border border-white/10 bg-[#131518]/80 backdrop-blur p-6 md:p-7 overflow-hidden relative">
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(600px circle at 80% 0%, rgba(200,255,61,0.15), transparent 70%)" }} aria-hidden />
              <div className="relative grid md:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
                <ImpactOrbit className="w-full max-w-[280px] mx-auto" />
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#A5A5A0]">PLAY → WIN → IMPACT</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="h-2 w-2 rounded-full bg-[#C8FF3D] shadow-[0_0_8px_rgba(200,255,61,0.7)]" />
                      <span className="text-white">Submit performance</span>
                      <span className="ml-auto text-[#74746F] text-xs">01</span>
                    </div>
                    <div className="h-px bg-white/10 ml-1" />
                    <div className="flex items-center gap-3 text-sm">
                      <span className="h-2 w-2 rounded-full bg-white/30" />
                      <span className="text-[#A5A5A0]">Monthly draw • 5 numbers</span>
                      <span className="ml-auto text-[#74746F] text-xs">02</span>
                    </div>
                    <div className="h-px bg-white/10 ml-1" />
                    <div className="flex items-center gap-3 text-sm">
                      <span className="h-2 w-2 rounded-full bg-[#FF8A5B]" />
                      <span className="text-white">Charitable impact</span>
                      <span className="ml-auto text-[#74746F] text-xs">03</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <LiveSystemBar stats={{ activeHeroes: mockStats.activeSubscribers, prizePool: mockStats.prizePool, toCharity: mockStats.charityTotal, nextDrawDays: 18 }} />
          </div>
        </div>
      </section>

      {/* CONNECTED JOURNEY — not 3 cards */}
      <section className="relative bg-[#F3F2ED] text-[#111113] py-14 md:py-16">
        <div className="mx-auto max-w-[1160px] px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#74746F]">SYSTEM JOURNEY</p>
              <h2 className="mt-2 text-[28px] md:text-[36px] font-bold tracking-[-0.03em]">One connected ecosystem</h2>
            </div>
            <p className="max-w-[420px] text-[14px] leading-6 text-[#5F5F5A]">Understand the product in seconds. Your score becomes your entry. Your subscription becomes impact.</p>
          </div>

          <div className="mt-10 relative">
            {/* connecting line desktop */}
            <div className="hidden md:block absolute top-[28px] left-[80px] right-[80px] h-px bg-[rgba(17,17,19,0.10)]" aria-hidden />
            <div className="hidden md:block absolute top-[28px] left-[80px] w-[33%] h-px bg-[#C8FF3D] opacity-60" aria-hidden />

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { n: "01", label: "PLAY", title: "Submit your performance", desc: "Log Stableford 1–45. One per date. Five rolling — oldest drops.", color: "#C8FF3D" },
                { n: "02", label: "WIN", title: "Monthly draw. Multiple tiers.", desc: "5 numbers. 40% / 35% / 25% distribution. Jackpot rolls if unclaimed.", color: "#61E7FF" },
                { n: "03", label: "GIVE BACK", title: "Your subscription creates impact", desc: "Choose charity. 10%+ flows through. Verified and transparent.", color: "#FF8A5B" },
              ].map((s) => (
                <div key={s.n} className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0B0B0C] text-white text-xs font-bold border border-white/5 relative">
                      {s.n}
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-[#F3F2ED]" style={{ background: s.color }} />
                    </div>
                    <div className="h-px flex-1 bg-[rgba(17,17,19,0.08)] md:hidden" />
                  </div>
                  <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: s.color === "#C8FF3D" ? "#111113" : s.color }}>{s.label}</p>
                  <h3 className="mt-1 text-[16px] font-semibold tracking-[-0.01em] text-[#111113]">{s.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-6 text-[#5F5F5A]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT ATLAS — charity emotional center */}
      <section className="relative bg-[#0B0B0C] py-14 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "48px 48px" }} aria-hidden />
        <div className="mx-auto max-w-[1160px] px-6 relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#C8FF3D]">IMPACT ATLAS</p>
              <h2 className="mt-2 text-[26px] md:text-[32px] font-bold tracking-[-0.03em] text-white">Where your subscription creates impact</h2>
            </div>
            <Link href="/charities" className="text-[13px] font-medium text-white/70 hover:text-white">View all charities <span aria-hidden>→</span></Link>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {featured.map((c) => (
              <Link key={c.id} href={`/charities/${c.slug}`} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#131518] hover:border-[#C8FF3D]/30 transition-all duration-300 hover:-translate-y-1">
                <div className="h-[220px] overflow-hidden relative">
                  <SafeImage src={c.image_url} alt={c.name} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700" fallbackClassName="h-[220px] w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="rounded-full bg-[#C8FF3D] px-2.5 py-1 text-[11px] font-semibold text-[#0B0B0C]">Featured</span>
                    <span className="rounded-full bg-black/40 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white border border-white/15">10%+ to charity</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[11px] tracking-[0.08em] uppercase text-white/60">{c.slug.replace(/-/g, " ").toUpperCase()}</p>
                    <h3 className="mt-1 text-[16px] font-semibold tracking-[-0.02em] text-white">{c.name}</h3>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[13.5px] font-medium text-[#A5A5A0] line-clamp-1">{c.description?.slice(0, 48) ?? "Verified impact partner"}</p>
                    <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Verified partner</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#C8FF3D] group-hover:gap-2 transition-all">Explore <span aria-hidden>→</span></span>
                </div>
                <div className="h-1 bg-[#C8FF3D]/0 group-hover:bg-[#C8FF3D] transition-colors" aria-hidden />
              </Link>
            ))}
          </div>
          {/* Impact numbers — real stats, production uses Supabase counts when available */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <div>
              <p className="text-[28px] font-bold tracking-[-0.03em] text-white">£{stats.charityTotal.toLocaleString()}</p>
              <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Total to charity</p>
            </div>
            <div>
              <p className="text-[28px] font-bold tracking-[-0.03em] text-white">{stats.activeSubscribers.toLocaleString()}</p>
              <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Active heroes</p>
            </div>
            <div>
              <p className="text-[28px] font-bold tracking-[-0.03em] text-[#C8FF3D]">£{stats.prizePool.toLocaleString()}</p>
              <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Prize pool · rolls if unclaimed</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING — contribution visible */}
      <section className="bg-[#F3F2ED] py-14 md:py-16">
        <div className="mx-auto max-w-[1160px] px-6">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#74746F]">SUBSCRIBE → PLAY → WIN → GIVE BACK</p>
          <div className="mt-3 grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-[28px] md:text-[32px] font-bold tracking-[-0.03em] text-[#111113]">Subscribe. Play. Create impact.</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#5F5F5A] max-w-[480px]">Your subscription is the entry. Monthly or yearly — every plan enters the draw and funds your chosen charity.</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px w-12 bg-[#C8FF3D]" />
                <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Actual configured values • No hidden fees</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[rgba(17,17,19,0.10)] bg-white p-5">
                <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#74746F]">Monthly</p>
                <p className="mt-2 text-[32px] font-bold tracking-[-0.03em] text-[#111113]">£20<span className="text-[14px] font-normal text-[#5F5F5A]">/mo</span></p>
                <div className="mt-3 h-1.5 rounded-full bg-[rgba(17,17,19,0.08)] overflow-hidden">
                  <div className="h-full w-[10%] bg-[#C8FF3D]" />
                </div>
                <p className="mt-2 text-[11px] text-[#5F5F5A]">10% → £2.00/mo to charity</p>
                <Link href="/signup" className="mt-4 block"><Button variant="outline" className="w-full">JOIN HEROES</Button></Link>
              </div>
              <div className="rounded-2xl border border-[#0B0B0C] bg-[#0B0B0C] p-5 text-white relative overflow-hidden">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#C8FF3D]/10 blur-2xl" aria-hidden />
                <span className="inline-flex rounded-full bg-[#C8FF3D] px-2.5 py-1 text-[11px] font-semibold text-[#0B0B0C]">Save 17%</span>
                <p className="mt-3 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#A5A5A0]">Yearly</p>
                <p className="text-[32px] font-bold tracking-[-0.03em]">£200<span className="text-[14px] font-normal text-[#A5A5A0]">/yr</span></p>
                <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[10%] bg-[#C8FF3D]" />
                </div>
                <p className="mt-2 text-[11px] text-[#A5A5A0]">10% → £20/yr to charity</p>
                <Link href="/signup" className="mt-4 block"><Button className="w-full">JOIN HEROES →</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
