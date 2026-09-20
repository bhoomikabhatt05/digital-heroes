"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SafeImage } from "@/components/ui/safe-image";
import type { Charity } from "@/lib/types";

export default function CharitiesClient({ charities }: { charities: Charity[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const filtered = charities.filter((c) => {
    const matchQ = !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.description?.toLowerCase().includes(q.toLowerCase());
    const matchF = filter === "all" || c.featured;
    return matchQ && matchF;
  });

  return (
    <>
      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <label htmlFor="charity-search" className="sr-only">Search charities</label>
          <Input id="charity-search" placeholder="Search charities..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111113] ${filter === "all" ? "bg-[#0B0B0C] text-white" : "border border-[rgba(17,17,19,0.10)] bg-white text-[#111113] hover:bg-[#F4F4F1]"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("featured")}
            aria-pressed={filter === "featured"}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111113] ${filter === "featured" ? "bg-[#C8FF3D] text-[#111113] border border-[#C8FF3D]" : "border border-[rgba(17,17,19,0.10)] bg-white text-[#111113] hover:bg-[#F4F4F1]"}`}
          >
            Featured
          </button>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,19,0.10)] bg-white hover:border-[#D1D1CC] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200"
          >
            <div className="h-44 overflow-hidden bg-[#F4F4F1]">
              <SafeImage
                src={c.image_url}
                alt={c.name}
                className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                fallbackClassName="h-44 w-full"
              />
            </div>
            <div className="p-5 flex flex-1 flex-col">
              <div className="flex items-center gap-2">
                {c.featured && <Badge variant="lime">Featured</Badge>}
                <Badge variant="outline">Active</Badge>
              </div>
              <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.02em] text-[#111113]">{c.name}</h3>
              <p className="mt-1.5 text-[13.5px] leading-5 text-[#6B6B78] line-clamp-3 flex-1">{c.description}</p>
              <Link
                href={`/charities/${c.slug}`}
                className="mt-4 inline-flex text-[13.5px] font-medium text-[#111113] hover:text-[#6B6B78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111113] rounded-full"
              >
                View charity <span aria-hidden className="ml-1">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-[rgba(17,17,19,0.10)] py-12 text-center">
          <p className="text-sm font-medium text-[#111113]">No charities found</p>
          <p className="mt-1 text-sm text-[#5F5F5A]">Try a different search or filter.</p>
        </div>
      )}
    </>
  );
}
