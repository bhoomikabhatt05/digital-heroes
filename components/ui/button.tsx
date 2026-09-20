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
    "inline-flex items-center justify-center font-medium rounded-[12px] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF3D] focus-visible:ring-offset-1 active:scale-[0.98]";
  const variants: Record<Variant, string> = {
    primary:
      "bg-[#C8FF3D] text-[#0B0B0C] hover:bg-[#B7EF2D] shadow-sm hover:shadow-md font-semibold",
    secondary:
      "bg-[#121214] text-[#F5F5F2] border border-white/10 hover:bg-[#171719] hover:border-white/15",
    ghost:
      "bg-transparent text-[#5F5F5A] hover:text-[#111113] hover:bg-black/[0.04] dark:text-[#A5A5A0] dark:hover:text-white dark:hover:bg-white/10",
    outline:
      "border border-[rgba(17,17,19,0.10)] bg-white text-[#111113] hover:bg-[#F4F4F1] dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/10",
    dark:
      "bg-white text-[#0B0B0C] hover:bg-[#F5F5F2] border border-white/20 shadow-sm",
  };
  const sizes: Record<Size, string> = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-6 text-[13.5px] tracking-[-0.01em]",
    lg: "h-12 px-8 text-[14px]",
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
