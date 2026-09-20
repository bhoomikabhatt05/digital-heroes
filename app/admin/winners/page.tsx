"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

type WinnerRow = { id: string; user_id: string; match_count: number; prize_amount: number; verification_status: "pending" | "verified" | "rejected"; payment_status: "pending" | "paid"; proof?: string };

export default function WinnersAdmin() {
  const [winners, setWinners] = useState<WinnerRow[]>([
    { id: "w1", user_id: "Alex Morgan", match_count: 5, prize_amount: 35736, verification_status: "pending", payment_status: "pending", proof: "https://picsum.photos/seed/proof1/400/300" },
    { id: "w2", user_id: "Sam Rivera", match_count: 4, prize_amount: 15632, verification_status: "pending", payment_status: "pending" },
    { id: "w3", user_id: "Jordan Lee", match_count: 3, prize_amount: 7440, verification_status: "verified", payment_status: "pending" },
  ]);
  const { toast } = useToast();

  function verify(id: string, status: "verified" | "rejected") {
    setWinners((p) => p.map((w) => w.id === id ? { ...w, verification_status: status } : w));
    toast(`Winner ${status}`, status === "verified" ? "success" : "info");
  }
  function markPaid(id: string) {
    setWinners((p) => p.map((w) => w.id === id ? { ...w, payment_status: "paid" as const } : w));
    toast("Payout marked paid", "success");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Winners</h1>
      <div className="space-y-4">
        {winners.map((w) => (
          <Card key={w.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{w.user_id} • {w.match_count} match • £{w.prize_amount.toLocaleString()}</p>
                <div className="flex gap-2 mt-1"><Badge variant={w.verification_status === "verified" ? "success" : w.verification_status === "rejected" ? "warning" : "outline"}>{w.verification_status}</Badge><Badge variant={w.payment_status === "paid" ? "success" : "outline"}>{w.payment_status}</Badge></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => verify(w.id, "verified")}>Approve</Button>
                <Button size="sm" variant="ghost" onClick={() => verify(w.id, "rejected")}>Reject</Button>
                <Button size="sm" onClick={() => markPaid(w.id)} disabled={w.verification_status !== "verified" || w.payment_status === "paid"}>Mark paid</Button>
              </div>
            </div>
            {w.proof && <img src={w.proof} alt="proof" className="mt-4 h-40 rounded-xl object-cover border" />}
            {!w.proof && <p className="text-xs text-zinc-500 mt-3">No proof uploaded yet.</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
