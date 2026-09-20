"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/charities", label: "Charities" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E8E3]/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-[#17171A]/80">
      <div className="mx-auto max-w-[1160px] px-6 h-[64px] flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-8 w-8 rounded-lg bg-[#111113] text-white dark:bg-white dark:text-[#111113] flex items-center justify-center text-xs font-bold tracking-wide group-hover:scale-[1.02] transition-transform">DH</div>
          <span className="font-semibold tracking-[-0.02em] text-[15px] text-[#111113] dark:text-white">Digital Heroes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-[13.5px]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-[#111113] text-white dark:bg-white dark:text-[#111113]"
                  : "text-[#6B6B78] hover:text-[#111113] hover:bg-[#F7F7F3] dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link href="/login" className="text-[13.5px] font-medium text-[#111113] hover:text-[#6B6B78] dark:text-white dark:hover:text-zinc-300 px-2 py-1">
            Log in
          </Link>
          <Link href="/signup">
            <Button size="sm" className="h-9 px-5">Join Heroes</Button>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E8E3] bg-white text-[#111113] dark:border-white/15 dark:bg-transparent dark:text-white"
        >
          <span aria-hidden>{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#E8E8E3] bg-white dark:border-white/10 dark:bg-[#17171A] px-6 py-6 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-2.5 text-[14px] font-medium ${isActive(l.href) ? "bg-[#111113] text-white" : "text-[#111113] dark:text-white"}`}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-[#E8E8E3] dark:border-white/10">
            <Link href="/login" onClick={() => setOpen(false)} className="text-center rounded-full border border-[#E8E8E3] py-2.5 text-sm font-medium dark:border-white/15 dark:text-white">
              Log in
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)}>
              <Button className="w-full">Join Heroes</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#E8E8E3] bg-white dark:border-white/10 dark:bg-[#0A0A0B]">
      <div className="mx-auto max-w-[1160px] px-6 py-12 md:py-14 grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 text-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#111113] dark:bg-white flex items-center justify-center text-white dark:text-[#111113] text-xs font-bold">DH</div>
            <span className="font-semibold tracking-[-0.02em] text-[#111113] dark:text-white">Digital Heroes</span>
          </div>
          <p className="mt-3 text-[13.5px] leading-6 text-[#6B6B78] dark:text-zinc-400 max-w-[320px]">
            Play. Win. Give back. Track your golf, enter the monthly draw, and turn every subscription into impact.
          </p>
          <p className="mt-4 text-xs font-medium tracking-wide uppercase text-[#8D8D98]">PLAY → WIN → GIVE BACK</p>
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-widest uppercase text-[#111113] dark:text-white">Platform</p>
          <div className="mt-3 flex flex-col gap-2.5 text-[13.5px] text-[#6B6B78] dark:text-zinc-400">
            <Link href="/how-it-works" className="hover:text-[#111113] dark:hover:text-white">How it works</Link>
            <Link href="/charities" className="hover:text-[#111113] dark:hover:text-white">Charities</Link>
            <Link href="/pricing" className="hover:text-[#111113] dark:hover:text-white">Pricing</Link>
          </div>
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-widest uppercase text-[#111113] dark:text-white">Account</p>
          <div className="mt-3 flex flex-col gap-2.5 text-[13.5px] text-[#6B6B78] dark:text-zinc-400">
            <Link href="/login" className="hover:text-[#111113] dark:hover:text-white">Log in</Link>
            <Link href="/signup" className="hover:text-[#111113] dark:hover:text-white">Sign up</Link>
            <Link href="/dashboard" className="hover:text-[#111113] dark:hover:text-white">Dashboard</Link>
          </div>
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-widest uppercase text-[#111113] dark:text-white">Legal</p>
          <div className="mt-3 flex flex-col gap-2.5 text-[13.5px] text-[#6B6B78] dark:text-zinc-400">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Contact</span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1160px] px-6 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-2 border-t border-[#E8E8E3] dark:border-white/10 pt-6 text-xs text-[#8D8D98]">
        <span>© 2026 Digital Heroes. Crafted for the hiring assignment.</span>
        <span className="text-[#8D8D98]">Stripe test mode • Demo data • No real payments</span>
      </div>
    </footer>
  );
}
