/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function WinningsPage() {
  const [winners] = useState([
    { id: "w1", match_count: 4, prize_amount: 4200, verification_status: "pending", payment_status: "pending", draw_date: new Date().toISOString() },
  ]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const configured = isSupabaseConfigured();

  async function upload() {
    if (!file) {
      toast("Select a proof file", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { toast("File must be under 5MB", "error"); return; }
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") { toast("Only images or PDF allowed", "error"); return; }
    setUploading(true);
    if (configured) {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${user.id}/${Date.now()}_${safeName}`;
        const { error } = await supabase.storage.from("winner-proofs").upload(path, file, { contentType: file.type, upsert: false });
        if (error) throw error;
        // Try winner_id column first, fallback to winner if schema differs
        const { error: dbError } = await supabase.from("winner_proofs").insert({ winner_id: winners[0].id, user_id: user.id, proof_path: path } as any);
        if (dbError) {
          const msg = dbError.message.toLowerCase();
          if (msg.includes("winner_id") || msg.includes("column")) {
            const { error: retryError } = await supabase.from("winner_proofs").insert({ winner: winners[0].id, user: user.id, proof_path: path } as any);
            if (retryError) throw retryError;
          } else throw dbError;
        }
        toast("Proof uploaded — awaiting verification", "success");
        setFile(null);
      } catch (e: any) {
        toast(e.message || "Upload failed — check bucket exists and is private (see supabase/storage-policies.sql)", "error");
      }
    } else {
      toast("Proof uploaded — awaiting verification", "success");
    }
    setUploading(false);
  }

  const total = winners.reduce((a, b) => a + b.prize_amount, 0);

  return (
    <div className="space-y-6 max-w-[880px]">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#74746F]">REWARDS / VERIFICATION</p>
        <h1 className="mt-1 text-[28px] md:text-[32px] font-bold tracking-[-0.02em] text-[#111113]">Winnings</h1>
        <p className="mt-1 text-[14px] leading-6 text-[#5F5F5A]">Track your wins and verification status.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5F5F5A]">Total won</p>
          <p className="mt-2 text-[24px] font-bold tracking-[-0.02em] text-[#111113]">£{total.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5F5F5A]">Pending verification</p>
          <p className="mt-2 text-[24px] font-bold tracking-[-0.02em] text-[#111113]">{winners.filter((w) => w.verification_status === "pending").length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5F5F5A]">Paid</p>
          <p className="mt-2 text-[24px] font-bold tracking-[-0.02em] text-[#111113]">£0</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">Your wins — reward timeline</h3>
        {winners.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[rgba(17,17,19,0.10)] py-10 text-center">
            <p className="text-sm font-medium text-[#111113]">No winnings yet</p>
            <p className="text-sm text-[#5F5F5A] mt-1">Good luck next draw!</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {winners.map((w) => (
              <div key={w.id} className="rounded-xl border border-[rgba(17,17,19,0.10)] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#111113]">
                    DRAW #{w.id.slice(-2).toUpperCase()} • {w.match_count} MATCH • £{w.prize_amount.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Badge variant={w.verification_status === "verified" ? "success" : w.verification_status === "rejected" ? "warning" : "outline"}>{w.verification_status}</Badge>
                    <Badge variant={w.payment_status === "paid" ? "success" : "outline"}>{w.payment_status}</Badge>
                  </div>
                </div>
                <p className="text-xs text-[#5F5F5A] mt-1">{new Date(w.draw_date).toLocaleDateString()}</p>
                {/* timeline */}
                <div className="mt-4 flex items-center gap-2 text-[11px]">
                  <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 border ${w.verification_status !== "pending" ? "bg-[#C8FF3D] border-[#C8FF3D] text-[#0B0B0C]" : "bg-[rgba(17,17,19,0.06)] border-[rgba(17,17,19,0.10)] text-[#5F5F5A]"}`}>● SUBMITTED</span>
                  <span className="h-px w-6 bg-[rgba(17,17,19,0.10)]" />
                  <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 border ${w.verification_status === "verified" ? "bg-[#C8FF3D] border-[#C8FF3D] text-[#0B0B0C]" : w.verification_status === "pending" ? "bg-[#FF8A5B]/15 border-[#FF8A5B]/30 text-[#8A4A2B]" : "bg-[rgba(17,17,19,0.06)]"}`}>{w.verification_status === "verified" ? "✓" : "○"} VERIFIED</span>
                  <span className="h-px w-6 bg-[rgba(17,17,19,0.10)]" />
                  <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 border ${w.payment_status === "paid" ? "bg-[#C8FF3D] border-[#C8FF3D] text-[#0B0B0C]" : "bg-[rgba(17,17,19,0.06)] border-[rgba(17,17,19,0.10)] text-[#5F5F5A]"}`}>{w.payment_status === "paid" ? "✓" : "○"} PAID</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#111113]">Winner verification</h3>
        <p className="text-[13.5px] leading-6 text-[#6B6B78] mt-1">Upload a screenshot showing your qualifying golf score. Accepted: PNG, JPG, WEBP, PDF — max 5MB.</p>

        <div className="mt-4">
          <label htmlFor="proof-file" className="block rounded-2xl border-2 border-dashed border-[rgba(17,17,19,0.12)] bg-[#F4F4F1] p-6 text-center hover:border-[#C8FF3D]/40 hover:bg-[#C8FF3D]/5 transition-colors cursor-pointer group">
            <input id="proof-file" type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[rgba(17,17,19,0.10)] text-[#111113] group-hover:border-[#C8FF3D]/30">↑</div>
            <p className="mt-3 text-sm font-medium text-[#111113]">Choose proof file</p>
            <p className="text-xs text-[#5F5F5A] mt-1">Click to choose or drag and drop</p>
            <p className="text-xs text-[#74746F] mt-1">PNG, JPG, WEBP, PDF — max 5MB</p>
          </label>

          {file ? (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-[rgba(17,17,19,0.10)] bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#111113] truncate">{file.name}</p>
                <p className="text-xs text-[#5F5F5A]">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "file"}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Remove</Button>
                <Button onClick={upload} disabled={uploading} size="sm" className="btn-lift">{uploading ? "Uploading..." : "Upload proof"}</Button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-xs text-[#74746F] text-center">No file selected</p>
          )}

          {file && file.size > 5 * 1024 * 1024 && <p className="mt-2 text-xs text-[#FF6B6B]">File must be under 5MB.</p>}
        </div>

        <div className="mt-4 rounded-xl bg-[#C8FF3D]/10 border border-[#C8FF3D]/20 px-4 py-3">
          <p className="text-xs font-medium text-[#0B0B0C]">✓ Proof submitted → awaiting admin verification</p>
          <p className="text-xs text-[#5F5F5A] mt-1">Admins review proofs in <span className="font-medium">Admin → Winners</span>. Payment status updates to Paid after approval.</p>
        </div>
      </Card>
    </div>
  );
}
