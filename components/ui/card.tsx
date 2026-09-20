import * as React from "react";

export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[#E8E8E3] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200 dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Explicit dark variant - guarantees readable light text
export function DarkCard({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#17171A] p-6 text-[#F7F7F3] shadow-[0_8px_24px_rgba(0,0,0,0.25)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props} />;
}
export function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-[15px] font-semibold tracking-[-0.01em] text-[#111113] dark:text-white ${className}`} {...props} />;
}
export function CardDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm leading-6 text-[#8D8D98] ${className}`} {...props} />;
}
