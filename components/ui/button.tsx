import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "dark";
type Size = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.98]";
  const variants: Record<Variant, string> = {
    primary:
      "bg-[#111113] text-white hover:bg-[#242428] focus-visible:ring-[#111113] shadow-sm hover:shadow-md",
    secondary:
      "bg-[#D9FF82] text-[#111113] hover:bg-[#C9EF7A] focus-visible:ring-[#D9FF82] font-semibold",
    ghost:
      "bg-transparent text-zinc-600 hover:bg-zinc-900/[0.06] hover:text-[#111113] dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10",
    outline:
      "border border-[#E8E8E3] bg-white text-[#111113] hover:bg-[#F7F7F3] hover:border-[#D1D1CC] dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/10",
    dark:
      "bg-white text-[#111113] hover:bg-zinc-100 border border-white/20 shadow-sm",
  };
  const sizes: Record<Size, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-[13.5px] tracking-[-0.01em]",
    lg: "h-12 px-8 text-[15px]",
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
