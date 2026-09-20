"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

export function SafeImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const [error, setError] = useState(false);
  const fallbackSrc = `https://picsum.photos/seed/${encodeURIComponent(alt.slice(0, 20))}/600/400`;
  const displaySrc = !src || error ? fallbackSrc : src;

  if (error && !src) {
    // graceful gradient fallback if picsum also fails
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 ${fallbackClassName || className}`}>
        <span className="text-xs font-medium tracking-wide text-zinc-500">{alt.slice(0, 2).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
