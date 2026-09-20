"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockCharities } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { SafeImage } from "@/components/ui/safe-image";

export default function AdminCharities() {
  const [charities, setCharities] = useState(mockCharities);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "" });
  const { toast } = useToast();

  function add() {
    if (!form.name || !form.slug) { toast("Name and slug required", "error"); return; }
    setCharities((p) => [{ id: Math.random().toString(36).slice(2), name: form.name, slug: form.slug, description: form.description, image_url: form.image_url || `https://picsum.photos/seed/${form.slug}/600/400`, featured: false, active: true, created_at: new Date().toISOString() } as any, ...p]);
    toast("Charity created", "success");
    setForm({ name: "", slug: "", description: "", image_url: "" });
  }

  function toggleFeatured(id: string) {
    setCharities((p) => p.map((c) => c.id === id ? { ...c, featured: !c.featured } : c));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Charities</h1>
      <Card>
        <h3 className="font-semibold">Create charity</h3>
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="New Charity" /></div>
          <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="new-charity" /></div>
          <div className="md:col-span-2"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" /></div>
          <div className="md:col-span-2"><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></div>
        </div>
        <Button onClick={add} className="mt-4">Create</Button>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {charities.map((c) => (
          <Card key={c.id}>
            <div className="h-32 rounded-xl overflow-hidden bg-[#F4F4F1]"><SafeImage src={c.image_url!} alt={c.name} className="h-full w-full object-cover" fallbackClassName="h-32 w-full" /></div>
            <h3 className="font-semibold mt-3 flex gap-2">{c.name} {c.featured && <Badge variant="lime">Featured</Badge>}</h3>
            <p className="text-sm text-zinc-500 line-clamp-2">{c.description}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleFeatured(c.id)}>{c.featured ? "Unfeature" : "Feature"}</Button>
              <Button variant="ghost" size="sm" onClick={() => setCharities((p) => p.filter((x) => x.id !== c.id))}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
