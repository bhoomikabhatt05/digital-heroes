import { Navbar, Footer } from "@/components/landing/navbar";
import { createClient } from "@/lib/supabase/server";
import { mockCharities } from "@/lib/mock-data";
import CharitiesClient from "./charities-client";

export default async function CharitiesPage() {
  let charities = mockCharities;
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.from("charities").select("*").eq("active", true).order("featured", { ascending: false });
      if (data && data.length) charities = data as unknown as typeof mockCharities;
    }
  } catch {}
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-[1160px] px-6 py-12 md:py-14">
        <div className="max-w-[640px]">
          <h1 className="text-[34px] md:text-[40px] font-bold tracking-[-0.03em] leading-[1.05] text-[#111113]">Charities</h1>
          <p className="mt-3 text-[15px] leading-6 text-[#6B6B78]">Choose where your impact goes. Minimum 10% — raise it anytime.</p>
        </div>
        <CharitiesClient charities={charities} />
      </div>
      <Footer />
    </div>
  );
}
