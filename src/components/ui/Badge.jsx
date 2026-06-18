const VARIANTS = {
  pass: "bg-signal-green/10 text-signal-green border-signal-green/30",
  fail: "bg-signal-red/10 text-signal-red border-signal-red/30",
  warn: "bg-signal-amber/10 text-signal-amber border-signal-amber/30",
  neutral: "bg-base-600/40 text-base-200 border-base-500",
  info: "bg-signal-blue/10 text-signal-blue border-signal-blue/30",
};

export function Badge({ variant = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-mono ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
