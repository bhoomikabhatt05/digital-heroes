export function BackgroundSystem() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* radial ambient */}
      <div className="absolute -top-[400px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse at center, #C8FF3D 0%, transparent 70%)" }} />
      <div className="absolute top-[600px] -right-[300px] w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #9B8CFF 0%, transparent 70%)" }} />
      {/* technical grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      {/* thin orbital trajectory */}
      <svg className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.06]" viewBox="0 0 800 400" fill="none">
        <ellipse cx="400" cy="200" rx="320" ry="120" stroke="white" strokeWidth="1" strokeDasharray="6 8" />
        <ellipse cx="400" cy="200" rx="240" ry="90" stroke="white" strokeWidth="1" opacity="0.5" />
      </svg>
    </div>
  );
}
