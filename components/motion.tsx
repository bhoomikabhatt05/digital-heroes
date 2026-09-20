"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";

export function PageEnter({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${visible ? "in" : ""} ${className}`} style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}>
      {children}
    </div>
  );
}

export function CountUp({ value, prefix = "", locale = true }: { value: number; prefix?: string; locale?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (hasRun) return;
    const el = ref.current?.parentElement;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setDisplay(value); setHasRun(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setHasRun(true);
      const start = performance.now();
      const dur = 1100;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(value * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, hasRun]);
  const text = locale ? display.toLocaleString() : String(display);
  return <span ref={ref}>{prefix}{text}</span>;
}
