"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockCharities } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { SafeImage } from "@/components/ui/safe-image";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminCharities() {
  const [charities, setCharities] = useState(mockCharities);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "" });
  const { toast } = useToast();
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("charities").select("*").order("created_at", { ascending: false });
      if (error) { toast(error.message, "error"); return; }
      if (data && data.length) setCharities(data as unknown as typeof mockCharities);
    })();
  }, [configured, toast]);

  async function add() {
    if (!form.name || !form.slug) { toast("Name and slug required", "error"); return; }
    const payload = { name: form.name, slug: form.slug, description: form.description, image_url: form.image_url || `https://picsum.photos/seed/${form.slug}/600/400`, featured: false, active: true };
    if (configured) {
      const supabase = createClient();
      const { data, error } = await supabase.from("charities").insert(payload).select().single();
      if (error) { toast(error.message, "error"); return; }
      if (data) setCharities((p) => [data as unknown as typeof mockCharities[number], ...p]);
      else setCharities((p) => [{ id: Math.random().toString(36).slice(2), ...payload, created_at: new Date().toISOString() } as unknown as typeof mockCharities[number], ...p]);
    } else {
      setCharities((p) => [{ id: Math.random().toString(36).slice(2), ...payload, created_at: new Date().toISOString() } as unknown as typeof mockCharities[number], ...p]);
    }
    toast("Charity created", "success");
    setForm({ name: "", slug: "", description: "", image_url: "" });
  }

  async function toggleFeatured(id: string) {
    const target = charities.find((c) => c.id === id);
    if (!target) return;
    if (configured) {
      const supabase = createClient();
      const { error } = await supabase.from("charities").update({ featured: !target.featured }).eq("id", id);
      if (error) { toast(error.message, "error"); return; }
    }
    setCharities((p) => p.map((c) => c.id === id ? { ...c, featured: !c.featured } : c));
  }

  async function removeCharity(id: string) {
    if (configured) {
      const supabase = createClient();
      const { error } = await supabase.from("charities").delete().eq("id", id);
      if (error) { toast(error.message, "error"); return; }
    }
    setCharities((p) => p.filter((x) => x.id !== id));
    toast("Charity removed", "success");
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
              <Button variant="ghost" size="sm" onClick={() => removeCharity(c.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
