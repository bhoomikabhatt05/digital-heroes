"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "digital-heroes-onboarding";

type Step = { title: string; text: string; href: string; cta: string };

const STEPS: Step[] = [
  { title: "1. CHOOSE YOUR IMPACT", text: "Pick a charity and choose how much of your subscription goes toward its work.", href: "/dashboard/charity", cta: "Choose charity" },
  { title: "2. TRACK YOUR SCORE", text: "Add your Stableford score after each round. Your latest five scores stay in your Score Orbit.", href: "/dashboard/scores", cta: "Track score" },
  { title: "3. CHECK YOUR DRAW", text: "Your five-number entry is generated automatically for each active draw.", href: "/dashboard/draws", cta: "Check draw" },
  { title: "4. TRACK YOUR WINNINGS", text: "If you win, upload your qualifying score proof and follow the verification process.", href: "/dashboard/winnings", cta: "Track winnings" },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const total = STEPS.length + 1; // +1 for final ready screen

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!v) setOpen(true);
    } catch {}
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleSkip();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSkip() {
    try { localStorage.setItem(STORAGE_KEY, "done"); } catch {}
    setOpen(false);
  }
  function handleNext() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else setStep(STEPS.length); // final screen
  }
  function handleDone() {
    try { localStorage.setItem(STORAGE_KEY, "done"); } catch {}
    setOpen(false);
  }

  if (!open) return null;

  const isFinal = step === STEPS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Onboarding">
      <div className="w-full max-w-[440px] rounded-[20px] border border-white/10 bg-[#0B0B0C] p-6 md:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[#C8FF3D]/10 blur-3xl pointer-events-none" aria-hidden />
        {/* progress */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#A5A5A0]">{isFinal ? "05 / 05" : `0${step + 1} / 0${total}`}</p>
          <div className="flex gap-1.5" aria-hidden>
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === step || (isFinal && i === total - 1) ? "bg-[#C8FF3D]" : i < step ? "bg-white/40" : "bg-white/15"}`} />
            ))}
          </div>
        </div>

        {!isFinal ? (
          <>
            {step === 0 && (
              <div>
                <p className="mt-5 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#C8FF3D]">WELCOME TO DIGITAL HEROES</p>
                <h3 className="mt-2 text-[18px] font-bold tracking-[-0.02em] text-white">Your game can do more than track a score.</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-[#A5A5A0]">Play your rounds, support a cause and take your chance in the monthly draw.</p>
              </div>
            )}
            <div className="mt-6">
              <h4 className="text-[13px] font-semibold tracking-[-0.01em] text-white">{STEPS[step].title}</h4>
              <p className="mt-1.5 text-[13.5px] leading-6 text-[#A5A5A0]">{STEPS[step].text}</p>
              <Link href={STEPS[step].href} className="mt-3 inline-flex text-xs font-medium text-[#C8FF3D] hover:text-white">{STEPS[step].cta} →</Link>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" className="flex-1 border border-white/10 text-white hover:bg-white/10" onClick={handleSkip}>SKIP TOUR</Button>
              <Button className="flex-1" onClick={handleNext}>NEXT →</Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="mt-4 text-[18px] font-bold tracking-[-0.02em] text-white">YOU&apos;RE READY</h3>
            <p className="mt-2 text-[13.5px] leading-6 text-[#A5A5A0]">Your journey starts with one score.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/dashboard/scores" className="flex-1" onClick={handleDone}>
                <Button className="w-full">ENTER YOUR FIRST SCORE →</Button>
              </Link>
            </div>
            <button onClick={handleDone} className="mt-3 w-full text-center text-xs font-medium text-[#A5A5A0] hover:text-white">EXPLORE MY DASHBOARD</button>
          </>
        )}
      </div>
    </div>
  );
}
