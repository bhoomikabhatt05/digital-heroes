import Link from "next/link";
import { Navbar, Footer } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { Card, DarkCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCharities, mockStats } from "@/lib/mock-data";
import { SafeImage } from "@/components/ui/safe-image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="mx-auto w-full max-w-[1160px] px-6 pt-10 md:pt-16 pb-12">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-start">
          <div className="pt-2">
            <Badge variant="lime" className="mb-5">Monthly draw • £89k prize pool • Next draw in 12 days</Badge>
            <h1 className="text-[48px] md:text-[68px] font-bold tracking-[-0.04em] leading-[0.88] text-[#111113]">
              PLAY<br />FOR<br />
              <span className="text-[#5F5F5A] font-bold">MORE.</span>
            </h1>
            <p className="mt-6 text-[17px] leading-7 text-[#6B6B78] max-w-[440px]">
              Track your game. Enter the monthly draw. Turn every subscription into something bigger.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-7 text-[14px]">
                  Join Heroes <span aria-hidden className="ml-2">→</span>
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg" className="h-12 px-7">
                  How it works
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 md:gap-10 border-t border-[rgba(17,17,19,0.10)] pt-6">
              <div>
                <p className="text-[22px] font-bold tracking-[-0.02em] text-[#111113]">{mockStats.activeSubscribers.toLocaleString()}</p>
                <p className="text-[12px] font-medium tracking-wide uppercase text-[#5F5F5A] mt-1">Active heroes</p>
              </div>
              <div>
                <p className="text-[22px] font-bold tracking-[-0.02em] text-[#111113]">£{mockStats.charityTotal.toLocaleString()}</p>
                <p className="text-[12px] font-medium tracking-wide uppercase text-[#5F5F5A] mt-1">To charity</p>
              </div>
              <div>
                <p className="text-[22px] font-bold tracking-[-0.02em] text-[#111113]">£{mockStats.prizePool.toLocaleString()}</p>
                <p className="text-[12px] font-medium tracking-wide uppercase text-[#5F5F5A] mt-1">Prize pool</p>
              </div>
            </div>
          </div>

          {/* Hero draw card */}
          <div className="relative">
            <DarkCard className="p-7 md:p-8 overflow-hidden relative">
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#C8FF3D]/20 blur-3xl pointer-events-none" aria-hidden />
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/60">Current draw</p>
              <p className="mt-2 text-[34px] font-bold tracking-[-0.03em] leading-none text-white">£{mockStats.prizePool.toLocaleString()}</p>
              <p className="mt-1.5 text-[13px] leading-5 text-white/60">Prize pool • 5 numbers • 3 tiers</p>

              <div className="mt-7 grid grid-cols-5 gap-2">
                {[7, 14, 23, 31, 42].map((n) => (
                  <div
                    key={n}
                    className="flex h-[52px] items-center justify-center rounded-2xl bg-white text-[#111113] text-[17px] font-bold tracking-[-0.02em] shadow-sm"
                  >
                    {n}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#111113]">5 match — 40%</span>
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white border border-white/15">4 match — 35%</span>
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white border border-white/15">3 match — 25%</span>
              </div>

              <p className="mt-6 text-xs leading-5 text-white/45">
                Jackpot rolls over if unclaimed. Multiple winners split tiers equally.
              </p>
            </DarkCard>

            <Card className="mt-4 flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C8FF3D] text-[#111113] text-sm">🏆</div>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold tracking-[-0.01em] text-[#111113]">Last month: 3 winners shared £31k</p>
                <p className="text-xs text-[#5F5F5A] mt-0.5">Verified • Paid within 48h</p>
              </div>
              <span className="ml-auto hidden md:inline-flex text-xs font-medium text-[#6B6B78] shrink-0">View →</span>
            </Card>
          </div>
        </div>
      </section>

      {/* PLAY → WIN → GIVE BACK */}
      <section className="bg-[#0B0B0C] text-white py-14 md:py-16">
        <div className="mx-auto max-w-[1160px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[26px] md:text-[30px] font-bold tracking-[-0.03em] text-white">PLAY → WIN → GIVE BACK</h2>
            <Link href="/how-it-works" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              Learn more <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {[
              { step: "01", title: "Track", desc: "Log Stableford scores (1–45). Keep your latest 5. Watch your trend climb.", icon: "◉" },
              { step: "02", title: "Enter", desc: "Every active subscription = automatic 5-number entry in the monthly draw.", icon: "🏆" },
              { step: "03", title: "Impact", desc: "Choose your charity. 10%+ of your subscription funds real change.", icon: "♥" },
            ].map((s) => (
              <div key={s.step} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.07] hover:border-white/15 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C8FF3D] text-[#111113] text-xs font-bold">{s.icon}</span>
                  <span className="text-xs font-medium tracking-widest text-white/35">{s.step}</span>
                </div>
                <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.01em] text-white">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-white/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto w-full max-w-[1160px] px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active subscribers", value: "8,921" },
            { label: "Avg. score (last 5)", value: "32.4" },
            { label: "Prize pool (Oct)", value: "£89,340" },
            { label: "Charity funded", value: "£142k" },
          ].map((s) => (
            <Card key={s.label} className="flex items-center gap-4 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B0B0C] text-white text-[10px]">●</div>
              <div className="min-w-0">
                <p className="text-[16px] font-bold tracking-[-0.02em] text-[#111113]">{s.value}</p>
                <p className="text-[11px] font-medium tracking-wide uppercase text-[#5F5F5A] mt-0.5 truncate">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured charities */}
      <section className="mx-auto w-full max-w-[1160px] px-6 pb-14 md:pb-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[22px] md:text-[24px] font-bold tracking-[-0.02em] text-[#111113]">Featured charities</h2>
          <Link href="/charities" className="text-[13.5px] font-medium text-[#111113] hover:text-[#6B6B78] shrink-0">
            View all <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {mockCharities
            .filter((c) => c.featured)
            .slice(0, 3)
            .map((c) => (
              <div
                key={c.id}
                className="group overflow-hidden rounded-2xl border border-[rgba(17,17,19,0.10)] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#D1D1CC] transition-all duration-200"
              >
                <div className="h-44 overflow-hidden bg-[#F4F4F1]">
                  <SafeImage
                    src={c.image_url}
                    alt={c.name}
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    fallbackClassName="h-44 w-full"
                  />
                </div>
                <div className="p-5">
                  <Badge variant="lime" className="text-[11px]">Featured</Badge>
                  <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.02em] text-[#111113]">{c.name}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-5 text-[#6B6B78] line-clamp-2">{c.description}</p>
                  <Link href={`/charities/${c.slug}`} className="mt-3 inline-flex text-[13.5px] font-medium text-[#111113] hover:text-[#6B6B78]">
                    Explore <span aria-hidden className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-[#C8FF3D] py-12 md:py-14">
        <div className="mx-auto max-w-[1160px] px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-[28px] md:text-[30px] font-bold tracking-[-0.03em] leading-[1.05] text-[#111113]">
              One subscription.
              <br />
              Game, draw, impact.
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-[#3A3A40] max-w-[420px]">
              Monthly or yearly. Yearly saves 17%. Cancel anytime. 10%+ to your chosen charity.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5">
              <p className="text-[12px] font-semibold tracking-widest uppercase text-[#5F5F5A]">Monthly</p>
              <p className="mt-2 text-[26px] font-bold tracking-[-0.02em] text-[#111113]">
                £20<span className="text-[13px] font-normal text-[#6B6B78]">/mo</span>
              </p>
              <Link href="/pricing" className="mt-4 inline-flex text-[13px] font-medium text-[#111113] hover:text-[#6B6B78]">
                View plans <span aria-hidden>→</span>
              </Link>
            </Card>
            <Card className="p-5 border-[#111113] shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              <Badge variant="lime" className="text-[11px]">Save 17%</Badge>
              <p className="mt-3 text-[12px] font-semibold tracking-widest uppercase text-[#5F5F5A]">Yearly</p>
              <p className="text-[26px] font-bold tracking-[-0.02em] text-[#111113]">
                £200<span className="text-[13px] font-normal text-[#6B6B78]">/yr</span>
              </p>
              <Link href="/pricing" className="mt-4 inline-flex text-[13px] font-medium text-[#111113] hover:text-[#6B6B78]">
                View plans <span aria-hidden>→</span>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
