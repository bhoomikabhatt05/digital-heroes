"use client";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockCharities } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { SafeImage } from "@/components/ui/safe-image";

export default function CharityPage() {
  const [charities, setCharities] = useState(mockCharities);
  const [selected, setSelected] = useState<string | null>(null);
  const [percentage, setPercentage] = useState(10);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    (async () => {
      const { data: ch } = await supabase.from("charities").select("*").eq("active", true);
      if (ch?.length) setCharities(ch as any);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("charity_id,charity_percentage").eq("id", user.id).single();
        if (profile) {
          setSelected(profile.charity_id);
          setPercentage(profile.charity_percentage ?? 10);
        }
      }
    })();
  }, [configured]);

  async function save() {
    if (percentage < 10) { toast("Minimum 10% required", "error"); return; }
    if (!selected) { toast("Select a charity", "error"); return; }
    setLoading(true);
    if (configured) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from("profiles").update({ charity_id: selected, charity_percentage: percentage }).eq("id", user.id);
        if (error) toast(error.message, "error");
        else toast("Charity preference saved", "success");
      }
    } else {
      toast("Saved in demo mode", "success");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 max-w-[880px]">
      <div>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[#111113]">Charity</h1>
        <p className="mt-1 text-[13.5px] leading-6 text-[#6B6B78]">Choose where your subscription makes impact. Minimum 10%.</p>
      </div>

      <Card className="p-6">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">Contribution</h3>
        <div className="mt-5 flex items-center gap-4">
          <input
            aria-label="Charity contribution percentage"
            type="range"
            min={10}
            max={100}
            value={percentage}
            onChange={(e) => setPercentage(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-[24px] font-bold tracking-[-0.02em] text-[#111113] w-16 text-right">{percentage}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[rgba(17,17,19,0.10)] overflow-hidden">
          <div className="h-full bg-[#C8FF3D] transition-all duration-200" style={{ width: `${percentage}%` }} />
        </div>
        <p className="text-xs leading-5 text-[#5F5F5A] mt-2">
          On a <span className="font-medium text-[#111113]">£20</span> plan, <span className="font-medium text-[#111113]">{percentage}%</span> = £{(20 * percentage / 100).toFixed(2)}/mo to charity.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {charities.map((c) => {
          const isSelected = selected === c.id;
          return (
            <div
              key={c.id}
              className={`overflow-hidden rounded-2xl border bg-white p-0 transition-all ${
                isSelected ? "border-[#111113] shadow-[0_4px_16px_rgba(0,0,0,0.08)] ring-1 ring-[#111113]" : "border-[rgba(17,17,19,0.10)] hover:border-[#D1D1CC] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              }`}
            >
              <div className="h-36 overflow-hidden bg-[#F4F4F1]">
                <SafeImage src={c.image_url!} alt={c.name} className="h-full w-full object-cover" fallbackClassName="h-36 w-full" />
              </div>
              <div className="p-5">
                <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113] flex items-center gap-2">
                  {c.name} {c.featured && <Badge variant="lime">Featured</Badge>}
                </h3>
                <p className="text-[13.5px] leading-5 text-[#6B6B78] mt-1 line-clamp-2">{c.description}</p>
                <Button
                  variant={isSelected ? "primary" : "outline"}
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => setSelected(c.id)}
                  aria-pressed={isSelected}
                >
                  {isSelected ? "Selected" : "Select"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={save} disabled={loading} className="h-11">
        {loading ? "Saving..." : "Save preferences"}
      </Button>
    </div>
  );
}
