export function StatCard({ label, value, accent = "text-base-100", sub }) {
  return (
    <div className="bg-base-800 border border-base-600 rounded-lg px-4 py-3.5">
      <div className="text-xs font-mono uppercase tracking-wideish text-base-400 mb-1.5">
        {label}
      </div>
      <div
        className={`text-2xl font-display font-semibold tracking-tightest ${accent}`}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-base-400 mt-1">{sub}</div>}
    </div>
  );
}
