import { Navbar, Footer } from "@/components/landing/navbar";
import { Card, DarkCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const features = [
  "Track unlimited scores (latest 5 retained)",
  "Automatic monthly draw entry",
  "Choose charity + set % (min 10%)",
  "Winnings & verification dashboard",
  "Cancel anytime",
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-[1160px] px-6 py-12 md:py-16">
        <div className="mx-auto max-w-[640px] text-center">
          <h1 className="text-[34px] md:text-[40px] font-bold tracking-[-0.03em] leading-[1.05] text-[#111113]">Simple pricing. Serious impact.</h1>
          <p className="mt-3 text-[15px] leading-6 text-[#6B6B78]">Pick your plan. Change or cancel anytime.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-5 max-w-[760px] mx-auto">
          <Card className="p-6 md:p-7 flex flex-col">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#5F5F5A]">Monthly</p>
            <p className="mt-3 text-[32px] font-bold tracking-[-0.03em] leading-none text-[#111113]">
              £20<span className="text-[14px] font-normal text-[#6B6B78]">/month</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-[13.5px] leading-6">
              {features.map((f) => (
                <li key={f} className="flex gap-2.5 text-[#3A3A40]">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="mt-7 block">
              <Button variant="outline" className="w-full h-11">Choose Monthly</Button>
            </Link>
          </Card>

          <Card className="p-6 md:p-7 flex flex-col border-[#111113] shadow-[0_8px_24px_rgba(0,0,0,0.08)] relative">
            <div className="absolute -top-3 left-6">
              <Badge variant="lime" className="shadow-sm">Most popular — Save 17%</Badge>
            </div>
            <p className="mt-4 text-xs font-semibold tracking-[0.14em] uppercase text-[#5F5F5A]">Yearly</p>
            <p className="mt-3 text-[32px] font-bold tracking-[-0.03em] leading-none text-[#111113]">
              £200<span className="text-[14px] font-normal text-[#6B6B78]">/year</span>
            </p>
            <p className="text-xs font-medium text-[#5F5F5A] mt-1">£16.67/mo billed annually</p>
            <ul className="mt-6 space-y-2.5 text-[13.5px] leading-6">
              {features.map((f) => (
                <li key={f} className="flex gap-2.5 text-[#3A3A40]">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="mt-7 block">
              <Button className="w-full h-11">Choose Yearly</Button>
            </Link>
          </Card>
        </div>

        <DarkCard className="mt-8 max-w-[760px] mx-auto p-6 flex gap-4">
          <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white text-sm border border-white/15">◉</div>
          <div>
            <p className="text-[13.5px] font-semibold tracking-[-0.01em] text-white">Stripe test mode</p>
            <p className="mt-1 text-[13.5px] leading-6 text-white/60">
              Use card <span className="font-mono text-white">4242 4242 4242 4242</span>, any future date, any CVC. No real charges. If Stripe env is missing, checkout runs in graceful demo mode.
            </p>
          </div>
        </DarkCard>
      </div>
      <Footer />
    </div>
  );
}
