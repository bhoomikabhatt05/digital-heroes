"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/scores", label: "Scores" },
  { href: "/dashboard/draws", label: "Draws" },
  { href: "/dashboard/charity", label: "Charity" },
  { href: "/dashboard/winnings", label: "Winnings" },
  { href: "/dashboard/settings", label: "Settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-1 text-[13.5px]">
      {nav.map((n) => {
        const active = isActive(pathname, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 font-medium transition-all duration-200 ${
              active
                ? "bg-[rgba(200,255,61,0.06)] text-white border border-[rgba(200,255,61,0.9)] shadow-[0_0_18px_rgba(200,255,61,0.12)]"
                : "text-[#A5A5A0] hover:text-white hover:bg-white/10 border border-transparent"
            }`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();
  return (
    <div className="md:hidden border-t border-white/10 overflow-x-auto">
      <div className="flex gap-1 px-6 py-2 text-sm whitespace-nowrap">
        {nav.map((n) => {
          const active = isActive(pathname, n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                active ? "bg-[rgba(200,255,61,0.06)] text-white border border-[rgba(200,255,61,0.9)] shadow-[0_0_14px_rgba(200,255,61,0.12)]" : "text-[#A5A5A0] hover:text-white border border-transparent"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
