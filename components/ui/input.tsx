import * as React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="flex h-11 w-full rounded-xl border border-[#E8E8E3] bg-white px-4 text-[14px] text-[#111113] placeholder:text-[#8D8D98] outline-none transition-colors focus:border-[#111113] focus:ring-2 focus:ring-[#111113]/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-white dark:focus:ring-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    />
  );
}
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="text-[13px] font-medium tracking-[-0.01em] text-[#111113] dark:text-zinc-200" {...props} />;
}
export function HelperText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-1.5 text-xs leading-5 text-[#8D8D98] ${className}`}>{children}</p>;
}
