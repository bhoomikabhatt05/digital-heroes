"use client";

export function ImpactOrbit({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <svg viewBox="0 0 360 360" className="w-full h-auto" fill="none">
        <defs>
          <radialGradient id="orbitGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#C8FF3D" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#C8FF3D" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="180" cy="180" r="120" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx="180" cy="180" r="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 6" className="orbit-path" />
        <circle cx="180" cy="180" r="160" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx="180" cy="180" r="120" fill="url(#orbitGrad)" className="hero-glow" />
        <path d="M 80 140 Q 180 80 280 140" stroke="#C8FF3D" strokeWidth="1" strokeOpacity="0.5" fill="none" className="orbit-path" />
        <path d="M 80 220 Q 180 280 280 220" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
        <g className="node-in node-in-1">
          <circle cx="80" cy="180" r="18" fill="#C8FF3D" className="signal-core" />
          <circle cx="80" cy="180" r="4" fill="#0B0B0C" />
          <text x="80" y="215" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" letterSpacing="0.08em">PLAY</text>
        </g>
        <g className="node-in node-in-2">
          <circle cx="180" cy="120" r="14" fill="#191B1F" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx="180" cy="120" r="4" fill="#C8FF3D" className="signal-core" />
          <text x="180" y="100" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="7" letterSpacing="0.12em">WIN</text>
        </g>
        <g className="node-in node-in-3">
          <circle cx="280" cy="180" r="18" fill="#0B0B0C" stroke="#C8FF3D" strokeWidth="1.5" />
          <circle cx="280" cy="180" r="5" fill="#C8FF3D" className="signal-core" />
          <text x="280" y="215" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" letterSpacing="0.08em">IMPACT</text>
        </g>
        <circle cx="120" cy="100" r="1" fill="#61E7FF" opacity="0.6" />
        <circle cx="240" cy="260" r="1" fill="#9B8CFF" opacity="0.5" />
        <circle cx="60" cy="260" r="1" fill="white" opacity="0.2" />
      </svg>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
}

export function LiveSystemBar({ stats }: { stats: { activeHeroes: number; prizePool: number; toCharity: number; nextDrawDays: number } }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#131518]/80 backdrop-blur p-4 md:p-5">
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#A5A5A0] flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#C8FF3D] shadow-[0_0_8px_rgba(200,255,61,0.6)] animate-pulse" aria-hidden />
        DIGITAL HEROES / LIVE
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Active heroes</p>
          <p className="text-[22px] font-bold tracking-[-0.02em] text-white mt-1">{stats.activeHeroes.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Prize pool</p>
          <p className="text-[22px] font-bold tracking-[-0.02em] text-white mt-1">£{stats.prizePool.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">To charity</p>
          <p className="text-[22px] font-bold tracking-[-0.02em] text-white mt-1">£{stats.toCharity.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.08em] uppercase text-[#74746F]">Next draw</p>
          <p className="text-[22px] font-bold tracking-[-0.02em] text-white mt-1">{stats.nextDrawDays} days</p>
        </div>
      </div>
      <div className="mt-4 h-px bg-white/10" />
      <div className="mt-3 flex items-center gap-2 text-[11px] text-[#A5A5A0]">
        <span className="h-1 w-1 rounded-full bg-[#61E7FF]" /> System operational
        <span className="ml-auto text-[#74746F]">Signal via lime trajectory</span>
      </div>
    </div>
  );
}

export function ScoreOrbit({ scores }: { scores: number[] }) {
  const points = scores.slice(0, 5);
  while (points.length < 5) points.push(0);
  const coords = [
    { x: 20, y: 50 },
    { x: 45, y: 30 },
    { x: 70, y: 55 },
    { x: 88, y: 35 },
    { x: 110, y: 60 },
  ];
  return (
    <div className="relative w-full h-[160px] md:h-[180px] overflow-hidden rounded-2xl border border-white/10 bg-[#0D0E10] p-4">
      <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#A5A5A0]">SCORE ORBIT — 5 rolling</p>
      <svg viewBox="0 0 140 80" className="absolute inset-0 w-full h-full pt-8" preserveAspectRatio="none">
        <path d={`M ${coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ")}`} fill="none" stroke="#C8FF3D" strokeWidth="1.2" opacity="0.9" />
        <path d={`M ${coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ")}`} fill="none" stroke="rgba(200,255,61,0.25)" strokeWidth="1.2" />
        {coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="6" fill={i === 0 ? "#C8FF3D" : "#191B1F"} stroke={i === 0 ? "#C8FF3D" : "rgba(255,255,255,0.15)"} strokeWidth="1" />
            <text x={c.x} y={c.y + 1} textAnchor="middle" fontSize="6" fontWeight="700" fill={i === 0 ? "#0B0B0C" : "white"}>
              {points[i] || "—"}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute bottom-3 left-4 right-4 flex justify-between text-[11px] text-[#74746F]">
        <span>Oldest</span>
        <span className="text-[#C8FF3D]">Latest →</span>
      </div>
    </div>
  );
}
