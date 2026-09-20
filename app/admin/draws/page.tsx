/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateDrawNumbers, calculatePrizePool, evaluateDrawEntries, calculateWinnerPayouts, applyJackpotRollover } from "@/lib/draw/engine";
import { useToast } from "@/components/ui/toast";

type DrawRow = { id: string; draw_date: string; status: "draft" | "simulated" | "published" | "completed"; draw_type: "random" | "algorithmic"; winning_numbers: number[] | null; prize_pool: number; jackpot_rollover: number };

export default function DrawManager() {
  const [draws, setDraws] = useState<DrawRow[]>([
    { id: "d1", draw_date: "2026-10-15T12:00:00.000Z", status: "draft", draw_type: "random", winning_numbers: null, prize_pool: 89340, jackpot_rollover: 12400 },
  ]);
  const [simData, setSimData] = useState<any>(null);
  const { toast } = useToast();

  function createDraw() {
    const d: DrawRow = { id: Math.random().toString(36).slice(2), draw_date: "2026-11-15T12:00:00.000Z", status: "draft", draw_type: "random", winning_numbers: null, prize_pool: calculatePrizePool(8921), jackpot_rollover: 0 };
    setDraws((p) => [d, ...p]);
    toast("Draw created", "success");
  }

  function generateNumbers(id: string) {
    const nums = generateDrawNumbers();
    setDraws((p) => p.map((d) => d.id === id ? { ...d, winning_numbers: nums } : d));
    toast(`Numbers generated: ${nums.join(", ")}`, "success");
  }

  function simulate(id: string) {
    const draw = draws.find((d) => d.id === id);
    if (!draw?.winning_numbers) { toast("Generate numbers first", "error"); return; }
    // mock entries
    const entries = Array.from({ length: 20 }, (_, i) => ({ user_id: `u${i}`, numbers: generateDrawNumbers() }));
    // force some winners for demo
    entries[0].numbers = [...draw.winning_numbers];
    entries[1].numbers = [...draw.winning_numbers.slice(0, 4), 99];
    entries[2].numbers = [...draw.winning_numbers.slice(0, 3), 98, 99];
    const results = evaluateDrawEntries(entries, draw.winning_numbers);
    const payouts = calculateWinnerPayouts(results, draw.prize_pool, draw.jackpot_rollover);
    const rollover = applyJackpotRollover(results, draw.prize_pool, draw.jackpot_rollover);
    setSimData({ results, payouts, rollover });
    setDraws((p) => p.map((d) => d.id === id ? { ...d, status: "simulated" as const } : d));
    toast("Simulation completed", "success");
  }

  function publish(id: string) {
    setDraws((p) => p.map((d) => d.id === id ? { ...d, status: "published" as const } : d));
    toast("Draw published", "success");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Draws</h1>
        <Button onClick={createDraw}>Create draw</Button>
      </div>

      <div className="space-y-4">
        {draws.map((d) => (
          <Card key={d.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{new Date(d.draw_date).toLocaleDateString()} • <Badge variant={d.status === "published" ? "success" : d.status === "simulated" ? "warning" : "outline"}>{d.status}</Badge> • {d.draw_type}</p>
                <p className="text-sm text-zinc-500">Prize £{d.prize_pool.toLocaleString()} {d.jackpot_rollover ? `+ £${d.jackpot_rollover} rollover` : ""}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => generateNumbers(d.id)}>Generate</Button>
                <Button variant="outline" size="sm" onClick={() => simulate(d.id)}>Simulate</Button>
                <Button size="sm" onClick={() => publish(d.id)} disabled={d.status === "published"}>Publish</Button>
              </div>
            </div>
            {d.winning_numbers && <div className="mt-3 flex gap-2">{d.winning_numbers.map((n) => <span key={n} className="h-9 w-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">{n}</span>)}</div>}
            {simData && <div className="mt-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4 text-sm">
              <p className="font-medium">Simulation: {simData.results.filter((r: any) => r.match_count >= 3).length} winners • Payouts: {simData.payouts.length} • Rollover if no 5-match: £{simData.rollover}</p>
              <div className="mt-2 space-y-1">{simData.payouts.map((p: any) => <p key={p.user_id} className="text-xs text-zinc-600 dark:text-zinc-400">{p.user_id}: {p.match_count} match → £{p.prize_amount}</p>)}</div>
            </div>}
          </Card>
        ))}
      </div>
    </div>
  );
}
