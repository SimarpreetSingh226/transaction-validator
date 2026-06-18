export function ProgressBar({ percent, label, variant = "amber" }) {
  const colors = {
    amber: "bg-signal-amber",
    green: "bg-signal-green",
  };
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-base-300">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-base-600 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[variant]} rounded-full transition-all duration-150 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
