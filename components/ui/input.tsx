import * as React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="flex h-11 w-full rounded-[12px] border border-[rgba(17,17,19,0.10)] bg-white px-4 text-[14px] text-[#111113] placeholder:text-[#A5A5A0] outline-none transition-colors focus:border-[#C8FF3D] focus:ring-2 focus:ring-[#C8FF3D]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    />
  );
}

export function DarkInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="flex h-11 w-full rounded-[12px] border border-white/10 bg-[#121214] px-4 text-[14px] text-white placeholder:text-[#74746F] outline-none transition-colors focus:border-[#C8FF3D] focus:ring-2 focus:ring-[#C8FF3D]/20"
      {...props}
    />
  );
}

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#5F5F5A]" {...props} />;
}

export function DarkLabel(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#A5A5A0]" {...props} />;
}
