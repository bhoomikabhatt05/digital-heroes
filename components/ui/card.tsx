import * as React from "react";

export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[rgba(17,17,19,0.10)] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DarkCard({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#171719] p-6 text-[#F5F5F2] shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function ElevatedCard({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#121214] p-6 text-[#F5F5F2] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props} />;
}
export function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-[15px] font-semibold tracking-[-0.01em] text-[#111113] ${className}`} {...props} />;
}
export function CardDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm leading-6 text-[#5F5F5A] ${className}`} {...props} />;
}
