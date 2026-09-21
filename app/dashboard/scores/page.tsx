"use client";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { validateScore, getOldestScoreId, sortScoresNewest } from "@/lib/scores";
import type { Score } from "@/lib/types";
import { ScoreOrbit } from "@/components/art/impact-orbit";

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([
    { id: "1", user_id: "demo", score: 32, played_on: "2026-09-18", created_at: "2026-09-18T00:00:00Z" },
    { id: "2", user_id: "demo", score: 28, played_on: "2026-09-17", created_at: "2026-09-17T00:00:00Z" },
  ]);
  const [playedOn, setPlayedOn] = useState("");
  const [scoreVal, setScoreVal] = useState("");
  const [editing, setEditing] = useState<Score | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("scores").select("*").eq("user_id", user.id).order("played_on", { ascending: false });
      if (data) setScores(data as Score[]);
    })();
  }, [supabaseConfigured]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const s = parseInt(scoreVal, 10);
    const err = validateScore(s, playedOn, editing ? scores.filter((x) => x.id !== editing.id).map((x) => x.played_on) : scores.map((x) => x.played_on));
    if (err) {
      toast(err, "error");
      return;
    }
    if (editing) {
      if (supabaseConfigured) {
        const supabase = createClient();
        const { error } = await supabase.from("scores").update({ score: s, played_on: playedOn }).eq("id", editing.id);
        if (error) { toast(error.message, "error"); return; }
        setScores((prev) => sortScoresNewest(prev.map((x) => (x.id === editing.id ? { ...x, score: s, played_on: playedOn } : x))));
      } else {
        setScores((prev) => sortScoresNewest(prev.map((x) => (x.id === editing.id ? { ...x, score: s, played_on: playedOn } : x))));
      }
      toast("Score updated", "success");
      setEditing(null);
      setPlayedOn("");
      setScoreVal("");
      return;
    }
    setLoading(true);
    let toRemove: string | null = null;
    if (scores.length >= 5) toRemove = getOldestScoreId(sortScoresNewest(scores));
    if (supabaseConfigured) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && toRemove) await supabase.from("scores").delete().eq("id", toRemove);
      if (user) {
        const { data, error } = await supabase.from("scores").insert({ user_id: user.id, score: s, played_on: playedOn }).select().single();
        if (error) { toast(error.message, "error"); setLoading(false); return; }
        if (data) setScores((prev) => {
          let next = [...prev, data as Score];
          if (next.length > 5) {
            const oldest = getOldestScoreId(sortScoresNewest(next));
            next = next.filter((x) => x.id !== oldest);
          }
          return sortScoresNewest(next);
        });
      }
    } else {
      const newScore: Score = { id: Math.random().toString(36).slice(2), user_id: "demo", score: s, played_on: playedOn, created_at: new Date().toISOString() };
      setScores((prev) => {
        let next = [...prev, newScore];
        if (next.length > 5) {
          const oldest = getOldestScoreId(sortScoresNewest(next));
          next = next.filter((x) => x.id !== oldest);
          toast("Rolling 5: oldest score removed", "info");
        }
        return sortScoresNewest(next);
      });
    }
    setLoading(false);
    toast("Score added", "success");
    setPlayedOn("");
    setScoreVal("");
  }

  async function handleDelete(id: string) {
    if (supabaseConfigured) {
      const supabase = createClient();
      const { error } = await supabase.from("scores").delete().eq("id", id);
      if (error) { toast(error.message, "error"); return; }
    }
    setScores((prev) => prev.filter((x) => x.id !== id));
    toast("Score deleted", "success");
  }

  function startEdit(s: Score) {
    setEditing(s);
    setPlayedOn(s.played_on);
    setScoreVal(String(s.score));
  }

  const avg = scores.length ? (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1) : "—";
  const sorted = sortScoresNewest(scores);

  return (
    <div className="space-y-6 max-w-[880px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#A5A5A0]">PERFORMANCE / SCORE ORBIT</p>
          <h1 className="mt-1 text-[28px] md:text-[32px] font-bold tracking-[-0.02em] text-white">Scores</h1>
          <p className="mt-1 text-[14px] leading-6 text-[#A5A5A0]">Stableford 1–45 • One per date • Latest 5 retained</p>
        </div>
        <Badge variant="dark" className="h-7 px-3 text-xs border-white/15">Avg: {avg}</Badge>
      </div>

      <ScoreOrbit scores={sorted.map((s) => s.score)} />

      <Card className="p-6">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">{editing ? "Edit score" : "Add score"}</h3>
        <form onSubmit={handleAdd} className="mt-4 grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="playedOn">Date</Label>
            <Input id="playedOn" type="date" value={playedOn} onChange={(e) => setPlayedOn(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="scoreVal">Score (1–45)</Label>
            <Input id="scoreVal" type="number" min={1} max={45} value={scoreVal} onChange={(e) => setScoreVal(e.target.value)} placeholder="32" required />
          </div>
          <div className="flex gap-2 md:pt-1">
            <Button type="submit" disabled={loading} className="h-11">
              {editing ? "Update" : loading ? "Adding..." : "Add score"}
            </Button>
            {editing && (
              <Button type="button" variant="ghost" onClick={() => { setEditing(null); setPlayedOn(""); setScoreVal(""); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
        <p className="text-xs leading-5 text-[#5F5F5A] mt-3">When you add a 6th score, the oldest is automatically removed.</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">History ({scores.length}/5)</h3>
        {sorted.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[rgba(17,17,19,0.10)] py-10 text-center">
            <p className="text-sm font-medium text-[#111113]">No scores yet</p>
            <p className="text-sm text-[#5F5F5A] mt-1">Add your first score above.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {sorted.map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-[rgba(17,17,19,0.10)] bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B0B0C] text-white text-sm font-bold">{s.score}</span>
                  <span className="text-sm font-medium text-[#111113]">{new Date(s.played_on).toLocaleDateString()}</span>
                  {idx === 0 && <Badge variant="lime">Latest</Badge>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(s)} aria-label={`Edit score ${s.score} on ${s.played_on}`}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} aria-label={`Delete score ${s.score}`}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
