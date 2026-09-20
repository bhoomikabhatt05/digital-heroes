import * as React from "react";

export function Badge({
  variant = "default",
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "outline" | "lime" | "dark" | "error" | "info" }) {
  const map: Record<string, string> = {
    default: "bg-[#0B0B0C] text-white",
    success: "bg-[#8EDB5A]/15 text-[#6BAF3A] border border-[#8EDB5A]/30",
    warning: "bg-[#F2C94C]/15 text-[#8A6D00] border border-[#F2C94C]/30",
    error: "bg-[#FF6B6B]/15 text-[#CC4444] border border-[#FF6B6B]/30",
    info: "bg-[#78A9FF]/15 text-[#3A6BC5] border border-[#78A9FF]/30",
    outline: "border border-[rgba(17,17,19,0.10)] text-[#5F5F5A] bg-white dark:border-white/10 dark:text-[#A5A5A0] dark:bg-transparent",
    lime: "bg-[#C8FF3D] text-[#0B0B0C] font-semibold border border-[#C8FF3D]",
    dark: "bg-white/10 text-[#F5F5F2] border border-white/10 backdrop-blur",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide leading-none ${map[variant]} ${className}`}
      {...props}
    />
  );
}
