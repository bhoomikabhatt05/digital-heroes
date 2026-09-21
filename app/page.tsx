import Link from "next/link";
import { Navbar, Footer } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { mockCharities } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import { ScoreOrbit } from "@/components/art/impact-orbit";
import { SafeImage } from "@/components/ui/safe-image";

function HeroOrbit() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto aspect-square">
      <div className="absolute inset-0 rounded-full border border-white/[0.06]" style={{ transform: "scale(0.92)" }} aria-hidden />
      <div className="absolute inset-0 rounded-full border border-white/[0.04] orbit-path" style={{ transform: "scale(0.68)" }} aria-hidden />
      {/* ambient lime glow */}
      <div className="absolute inset-0 rounded-full hero-glow opacity-30" style={{ background: "radial-gradient(circle, rgba(200,255,61,0.08) 0%, transparent 62%)" }} aria-hidden />
      {/* center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-full bg-[#131518] border border-white/10 w-[132px] h-[132px] md:w-[148px] md:h-[148px]">
        <p className="text-[11px] tracking-[0.10em] uppercase text-[#A5A5A0]">Impact Orbit</p>
        <div className="mt-1 h-1 w-6 bg-[#C8FF3D] rounded-full" />
      </div>
      {/* nodes */}
      <div className="absolute left-[6%] top-[18%] flex flex-col items-center gap-1.5 node-in" style={{ animationDelay: "0ms" }}>
        <div className="rounded-full bg-white text-[#0B0B0C] w-[64px] h-[64px] flex flex-col items-center justify-center border border-white">
          <span className="text-[10px] tracking-[0.08em] uppercase text-[#5F5F5A]">Score</span>
          <span className="text-[11px] font-bold">28</span>
          <span className="text-[10px] text-[#5F5F5A]">Stableford</span>
        </div>
        <span className="text-[10px] tracking-wide text-[#A5A5A0]">LATEST SCORE</span>
      </div>
      <div className="absolute right-[8%] top-[20%] flex flex-col items-center gap-1.5 node-in" style={{ animationDelay: "120ms" }}>
        <div className="rounded-full bg-[#C8FF3D] text-[#0B0B0C] w-[64px] h-[64px] flex flex-col items-center justify-center font-bold">
          <span className="text-[11px]">10%</span>
          <span className="text-[10px]">→ Charity</span>
        </div>
        <span className="text-[10px] tracking-wide text-[#A5A5A0]">IMPACT</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[14%] flex flex-col items-center gap-1.5 node-in" style={{ animationDelay: "240ms" }}>
        <div className="rounded-2xl bg-[#131518] border border-white/10 px-3 py-2 flex gap-1.5">
          {[7,14,23,31,42].map(n => <span key={n} className="w-6 h-6 rounded-full bg-white text-[#0B0B0C] flex items-center justify-center text-[11px] font-bold">{n}</span>)}
        </div>
        <span className="text-[10px] tracking-wide text-[#A5A5A0]">NEXT DRAW</span>
      </div>
      {/* thin orbital paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" viewBox="0 0 400 400" fill="none" aria-hidden>
        <ellipse cx="200" cy="200" rx="150" ry="110" stroke="white" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="92" ry="92" stroke="white" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default async function HomePage() {
  let charities = mockCharities;
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.from("charities").select("*").eq("active", true).order("featured", { ascending: false });
      if (data && data.length) charities = data as unknown as typeof mockCharities;
    }
  } catch {}
  const featured = charities.filter(c => c.featured).slice(0, 3);
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0C] text-white relative overflow-hidden">
      {/* hero background - subtle moving lime */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-[18%] -right-[10%] w-[680px] h-[420px] rounded-full opacity-[0.06] hero-glow" style={{ background: "radial-gradient(circle, rgba(200,255,61,0.12) 0%, transparent 68%)" }} />
      </div>
      <Navbar />

      {/* HERO — Cinematic */}
      <section className="relative mx-auto w-full max-w-[1160px] px-6 pt-10 md:pt-14 pb-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-[44px] md:text-[72px] font-black tracking-[-0.05em] leading-[0.88] text-white">
              PLAY YOUR<br />ROUND.<br /><span className="text-[#C8FF3D]">MOVE SOMETHING.</span>
            </h1>
            <p className="mt-6 text-[15px] leading-7 text-[#A5A5A0] max-w-[420px]">Your scores create your chance to win.<br />Your subscription creates real-world impact.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup"><Button size="lg" className="h-12 px-7 btn-lift">START YOUR JOURNEY <span className="ml-2 btn-arrow">→</span></Button></Link>
              <Link href="/how-it-works"><Button variant="secondary" size="lg" className="h-12 px-7">SEE HOW IT WORKS ↓</Button></Link>
            </div>
          </div>
          <HeroOrbit />
        </div>
      </section>

      {/* ONE ROUND. THREE OUTCOMES. */}
      <section className="relative bg-[#F3F2ED] text-[#111113] py-14 md:py-20">
        <div className="mx-auto max-w-[1160px] px-6 text-center">
          <h2 className="text-[28px] md:text-[44px] font-black tracking-[-0.04em] leading-[0.9]">ONE ROUND.<br />THREE OUTCOMES.</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-left max-w-[880px] mx-auto">
            {[
              { n: "01", t: "TRACK", d: "Your game becomes your entry." },
              { n: "02", t: "IMPACT", d: "Your subscription supports a cause you choose." },
              { n: "03", t: "WIN", d: "Match your numbers. Share the prize." },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#A5A5A0]">{s.n}</p>
                <h3 className="mt-2 text-[18px] font-bold tracking-[-0.02em]">{s.t}</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-[#5F5F5A]">{s.d}</p>
                {i < 2 && <div className="hidden md:block absolute top-6 -right-4 h-px w-8 bg-[rgba(17,17,19,0.10)]" aria-hidden />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE DOES YOUR SUBSCRIPTION GO? */}
      <section className="relative bg-[#0B0B0C] py-14 md:py-20 overflow-hidden">
        <div className="mx-auto max-w-[1160px] px-6 relative">
          <p className="text-[11px] tracking-[0.12em] uppercase text-[#C8FF3D]">WHERE DOES YOUR SUBSCRIPTION GO?</p>
          <div className="mt-6 grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[56px] md:text-[72px] font-black tracking-[-0.04em] text-white leading-none">10%</p>
                <p className="text-[11px] tracking-[0.08em] uppercase text-[#A5A5A0]">OF YOUR SUBSCRIPTION</p>
              </div>
              <div className="hidden md:flex flex-col items-center gap-2 text-[#C8FF3D]">
                <span className="h-8 w-px bg-[#C8FF3D]/40" />
                <span>↓</span>
                <span className="h-8 w-px bg-[#C8FF3D]/40" />
              </div>
              <div className="rounded-2xl bg-[#131518] border border-white/10 px-5 py-4">
                <p className="text-[11px] tracking-[0.08em] uppercase text-[#A5A5A0]">→ Clean Water Initiative</p>
                <p className="mt-1 text-sm font-semibold text-white">Verified charity partner</p>
                <p className="text-xs text-[#A5A5A0] mt-1">Featured • 10%+ impact</p>
              </div>
            </div>
            <p className="text-[14px] leading-6 text-[#A5A5A0] max-w-[360px]">Choose a charity at signup and decide how much of your subscription you want to contribute.</p>
          </div>
        </div>
      </section>

      {/* YOUR GAME. IN ORBIT. */}
      <section className="relative bg-[#F3F2ED] py-14 md:py-16">
        <div className="mx-auto max-w-[1160px] px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-black tracking-[-0.03em] text-[#111113]">YOUR GAME.<br />IN ORBIT.</h2>
            <p className="mt-3 text-[14px] leading-6 text-[#5F5F5A]">Your latest five Stableford scores, kept in one place.</p>
            <div className="mt-4 flex gap-2 text-[11px] tracking-wide">
              <span className="rounded-full border border-[rgba(17,17,19,0.10)] px-3 py-1">STABLEFORD 1–45</span>
              <span className="rounded-full bg-[#C8FF3D] px-3 py-1 font-semibold">LATEST 5 RETAINED</span>
            </div>
          </div>
          <div className="rounded-3xl border border-[rgba(17,17,19,0.08)] bg-white p-4">
            <ScoreOrbit scores={[28,31,23,14,7]} />
          </div>
        </div>
      </section>

      {/* HOW YOU WIN */}
      <section className="relative bg-white py-12">
        <div className="mx-auto max-w-[880px] px-6">
          <div className="hidden md:flex items-center justify-between text-[11px] tracking-[0.12em] uppercase text-[#A5A5A0]">
            <span>01 PLAY</span><span className="h-px flex-1 mx-4 bg-[rgba(17,17,19,0.08)]" /><span>02 MATCH</span><span className="h-px flex-1 mx-4 bg-[rgba(17,17,19,0.08)]" /><span>03 WIN</span>
          </div>
          <div className="mt-4 grid md:grid-cols-3 gap-6">
            <div><h3 className="font-bold">01 — PLAY</h3><p className="text-sm text-[#5F5F5A] mt-1">Add your Stableford score.</p></div>
            <div><h3 className="font-bold">02 — MATCH</h3><p className="text-sm text-[#5F5F5A] mt-1">Your five-number entry is generated automatically.</p></div>
            <div><h3 className="font-bold">03 — WIN</h3><p className="text-sm text-[#5F5F5A] mt-1">Match 3, 4 or 5 numbers and follow verification if you win.</p></div>
          </div>
        </div>
      </section>

      {/* DRAW VISUAL */}
      <section className="relative bg-[#0B0B0C] py-12">
        <div className="mx-auto max-w-[880px] px-6 text-center">
          <div className="flex justify-center gap-2">
            {[7,14,23,31,42].map(n => <span key={n} className="w-10 h-10 rounded-full bg-white text-[#0B0B0C] flex items-center justify-center font-bold text-sm">{n}</span>)}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-[520px] mx-auto">
            <div className="rounded-2xl bg-white text-[#0B0B0C] p-4"><p className="font-black">5 MATCH</p><p className="text-sm text-[#5F5F5A]">40%</p></div>
            <div className="rounded-2xl bg-[#131518] border border-white/10 text-white p-4"><p className="font-bold">4 MATCH</p><p className="text-sm text-[#A5A5A0]">35%</p></div>
            <div className="rounded-2xl bg-[#131518] border border-white/10 text-white p-4"><p className="font-bold">3 MATCH</p><p className="text-sm text-[#A5A5A0]">25%</p></div>
          </div>
        </div>
      </section>

      {/* IMPACT ATLAS preview — fixed images */}
      <section className="relative bg-[#0B0B0C] py-12">
        <div className="mx-auto max-w-[1160px] px-6">
          <div className="grid md:grid-cols-3 gap-5">
            {featured.slice(0,3).map(c => (
              <Link key={c.id} href={`/charities/${c.slug}`} className="group rounded-2xl overflow-hidden border border-white/10 bg-[#131518] hover:border-[#C8FF3D]/20 transition-all hover:-translate-y-1 block">
                <div className="h-[180px] overflow-hidden bg-[#0B0B0C] relative">
                  <SafeImage src={c.image_url} alt={c.name} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700" fallbackClassName="h-[180px] w-full bg-gradient-to-br from-[#131518] to-[#0B0B0C] flex items-center justify-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" aria-hidden />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-white text-sm group-hover:text-[#C8FF3D] transition-colors">{c.name}</p>
                  <p className="text-xs text-[#A5A5A0] line-clamp-2 mt-1">{c.description}</p>
                  <span className="mt-2 inline-flex text-xs font-medium text-[#C8FF3D]">Explore <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative bg-[#0B0B0C] py-20 md:py-28 border-t border-white/5">
        <div className="mx-auto max-w-[1160px] px-6 text-center">
          <h2 className="text-[36px] md:text-[56px] font-black tracking-[-0.04em] leading-[0.9] text-white">YOUR NEXT ROUND<br />CAN DO MORE.</h2>
          <p className="mt-4 text-[14px] leading-6 text-[#A5A5A0]">Track your game. Support a cause. Take your chance.</p>
          <Link href="/signup" className="mt-8 inline-block"><Button size="lg" className="h-12 px-8">START YOUR JOURNEY <span className="ml-2">→</span></Button></Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
