import { Navbar, Footer } from "@/components/landing/navbar";
import { Card, DarkCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-[1160px] px-6 py-12 md:py-16">
        <div className="max-w-[760px]">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#8D8D98]">PLAY → WIN → GIVE BACK</p>
          <h1 className="mt-3 text-[34px] md:text-[42px] font-bold tracking-[-0.03em] leading-[1.05] text-[#111113]">How it works</h1>
          <p className="mt-4 text-[16px] leading-7 text-[#6B6B78] max-w-[560px]">
            Digital Heroes merges performance tracking with a monthly prize draw — and every subscription funds charity. Editorial, minimal, transparent.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            { n: "01", title: "Track scores", desc: "Log Stableford points 1–45. One entry per date. We keep your latest 5 and show trends.", meta: "Stableford • 1–45" },
            { n: "02", title: "Stay subscribed", desc: "Monthly (£20) or Yearly (£200). Active subscribers are auto-entered with 5 numbers.", meta: "Monthly or yearly" },
            { n: "03", title: "Monthly draw", desc: "5 winning numbers drawn. Match 3/4/5 to win. Tiers split 25%/35%/40%. Jackpot rolls over.", meta: "5 numbers • 3 tiers" },
          ].map((s) => (
            <Card key={s.n} className="p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111113] text-white text-xs font-bold">{s.n}</span>
                <span className="text-xs font-medium tracking-wide text-[#8D8D98]">{s.meta}</span>
              </div>
              <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.01em] text-[#111113]">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-6 text-[#6B6B78]">{s.desc}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#111113]">Prize tiers</h3>
            <Badge variant="outline">50% of subscription revenue → prize pool</Badge>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-2xl bg-[#111113] text-white p-5 text-center">
              <p className="text-[28px] font-bold tracking-[-0.02em] leading-none text-white">40%</p>
              <p className="mt-1.5 text-xs font-medium tracking-wide uppercase text-white/60">5 match • Jackpot</p>
            </div>
            <div className="rounded-2xl bg-[#F7F7F3] border border-[#E8E8E3] p-5 text-center">
              <p className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#111113]">35%</p>
              <p className="mt-1.5 text-xs font-medium tracking-wide uppercase text-[#8D8D98]">4 match</p>
            </div>
            <div className="rounded-2xl bg-[#F7F7F3] border border-[#E8E8E3] p-5 text-center">
              <p className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#111113]">25%</p>
              <p className="mt-1.5 text-xs font-medium tracking-wide uppercase text-[#8D8D98]">3 match</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#8D8D98]">
            Multiple winners in a tier split the tier equally. 5-match jackpot rolls over if unclaimed.
          </p>
        </Card>

        <div className="mt-5 grid md:grid-cols-2 gap-5">
          <Card className="p-6">
            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#111113]">Charity</h3>
            <p className="mt-2 text-[13.5px] leading-6 text-[#6B6B78]">
              Choose a charity at signup. Set your contribution (min 10%). Change anytime in dashboard. Featured charities are verified partners.
            </p>
            <div className="mt-4 flex gap-2">
              <Badge variant="lime">Featured</Badge>
              <Badge variant="outline">Verified partner</Badge>
            </div>
          </Card>
          <DarkCard className="p-6">
            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-white">Verification</h3>
            <p className="mt-2 text-[13.5px] leading-6 text-white/60">
              Winners upload proof. Admin verifies/rejects. Payout marked pending → paid. Every step is transparent and auditable.
            </p>
            <div className="mt-4 flex gap-2">
              <Badge variant="dark">Pending</Badge>
              <Badge variant="lime">Verified</Badge>
              <Badge variant="dark">Paid</Badge>
            </div>
          </DarkCard>
        </div>
      </div>
      <Footer />
    </div>
  );
}
