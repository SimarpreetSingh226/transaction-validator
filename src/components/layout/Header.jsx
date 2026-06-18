import {
  useValidationContext,
  STAGE,
} from "../../context/ValidationContext.jsx";

export function Header() {
  const { stage } = useValidationContext();

  const statusConfig = {
    [STAGE.IDLE]: { label: "Awaiting file", color: "bg-base-400" },
    [STAGE.PARSED]: { label: "File parsed", color: "bg-signal-blue" },
    [STAGE.VALIDATING]: {
      label: "Validating",
      color: "bg-signal-amber animate-pulse-dot",
    },
    [STAGE.DONE]: { label: "Validation complete", color: "bg-signal-green" },
  };
  const status = statusConfig[stage];

  return (
    <header className="border-b border-base-600 bg-base-950/95 backdrop-blur sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-signal-amber flex items-center justify-center font-display font-bold text-base-950 text-sm">
            L
          </div>
          <div>
            <h1 className="font-display font-semibold text-base-100 text-lg tracking-tightest leading-none">
              Ledger
            </h1>
            <p className="text-xs text-base-400 font-mono leading-none mt-0.5">
              transaction data validator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-base-300">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          {status.label}
        </div>
      </div>
    </header>
  );
}
