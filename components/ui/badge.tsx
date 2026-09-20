import * as React from "react";

export function Badge({
  variant = "default",
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "outline" | "lime" | "dark" }) {
  const map: Record<string, string> = {
    default: "bg-[#111113] text-white",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    outline: "border border-[#E8E8E3] text-[#6B6B78] bg-white dark:border-white/15 dark:text-zinc-300 dark:bg-transparent",
    lime: "bg-[#D9FF82] text-[#111113] font-semibold border border-[#D9FF82]",
    dark: "bg-white/10 text-white border border-white/15 backdrop-blur",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide leading-none ${map[variant]} ${className}`}
      {...props}
    />
  );
}
