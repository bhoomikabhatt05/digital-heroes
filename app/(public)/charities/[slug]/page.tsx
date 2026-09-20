import { Navbar, Footer } from "@/components/landing/navbar";
import { Card, DarkCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { mockCharities } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { SafeImage } from "@/components/ui/safe-image";

export default async function CharityDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let charity: any = mockCharities.find((c) => c.slug === slug);
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.from("charities").select("*").eq("slug", slug).single();
      if (data) charity = data;
    }
  } catch {}
  if (!charity) return notFound();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-[1160px] px-6 py-8 md:py-12">
        <Link href="/charities" className="inline-flex text-[13.5px] font-medium text-[#6B6B78] hover:text-[#111113]">
          <span aria-hidden className="mr-1">←</span> Back to charities
        </Link>
        <div className="mt-6 overflow-hidden rounded-3xl border border-[#E8E8E3] bg-white">
          <div className="h-[320px] md:h-[420px] overflow-hidden bg-[#F7F7F3]">
            <SafeImage src={charity.image_url} alt={charity.name} className="h-full w-full object-cover" fallbackClassName="h-[320px] md:h-[420px] w-full" />
          </div>
        </div>
        <div className="mt-6 max-w-[720px]">
          <div className="flex gap-2">
            {charity.featured && <Badge variant="lime">Featured</Badge>}
            <Badge variant="outline">Verified partner</Badge>
          </div>
          <h1 className="mt-3 text-[30px] md:text-[36px] font-bold tracking-[-0.03em] text-[#111113]">{charity.name}</h1>
          <p className="mt-3 text-[15px] leading-7 text-[#6B6B78]">{charity.description}</p>
          <DarkCard className="mt-8 p-6">
            <p className="text-[14px] font-semibold tracking-[-0.01em] text-white">Support {charity.name} with Digital Heroes</p>
            <p className="mt-1.5 text-[13.5px] leading-6 text-white/60">Select this charity during signup or change it anytime in your dashboard. Your contribution starts at 10%.</p>
            <Link href="/signup" className="mt-4 inline-block">
              <Button variant="secondary">Join and select this charity</Button>
            </Link>
          </DarkCard>
        </div>
      </div>
      <Footer />
    </div>
  );
}
