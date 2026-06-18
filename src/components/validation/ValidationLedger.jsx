import { useEffect, useRef } from "react";
import {
  useValidationContext,
  STAGE,
} from "../../context/ValidationContext.jsx";
import { Card, CardHeader, CardBody } from "../ui/Card.jsx";
import { ProgressBar } from "../ui/ProgressBar.jsx";

export function ValidationLedger() {
  const { stage, liveFeed, progress } = useValidationContext();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [liveFeed]);

  if (stage !== STAGE.VALIDATING && stage !== STAGE.DONE) return null;

  const percent = progress.total
    ? Math.round((progress.processed / progress.total) * 100)
    : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <h3 className="font-display font-medium text-sm text-base-100">
          Validation ledger
        </h3>
        <span className="text-xs font-mono text-base-400">
          {progress.processed.toLocaleString()} /{" "}
          {progress.total.toLocaleString()} rows
        </span>
      </CardHeader>
      <div className="px-5 pt-3">
        <ProgressBar
          percent={percent}
          variant={stage === STAGE.DONE ? "green" : "amber"}
        />
      </div>
      <CardBody className="p-0">
        <div
          ref={scrollRef}
          className="h-64 overflow-y-auto bg-base-900 font-mono text-xs leading-relaxed px-5 py-3"
        >
          {liveFeed.length === 0 && (
            <div className="text-base-500">awaiting first batch…</div>
          )}
          {liveFeed.map((entry, idx) => (
            <LedgerLine key={`${entry.rowIndex}-${idx}`} entry={entry} />
          ))}
          {stage === STAGE.VALIDATING && (
            <div className="text-signal-amber animate-pulse-dot mt-1">
              ▌ processing…
            </div>
          )}
          {stage === STAGE.DONE && (
            <div className="text-signal-green mt-2 pt-2 border-t border-base-700">
              ✓ validation run complete — {progress.total.toLocaleString()} rows
              processed
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function LedgerLine({ entry }) {
  const rowLabel = `row ${String(entry.rowIndex + 1).padStart(5, "0")}`;
  const orderId = entry.cleanedRow?.order_id || entry.original?.order_id || "—";

  if (entry.valid) {
    return (
      <div className="flex items-start gap-2 animate-slide-in py-0.5">
        <span className="text-signal-green shrink-0">✓</span>
        <span className="text-base-400 shrink-0">{rowLabel}</span>
        <span className="text-base-300 truncate">
          order {orderId} — passed all checks
        </span>
      </div>
    );
  }

  const firstIssue = entry.issues[0];
  return (
    <div className="flex items-start gap-2 animate-slide-in py-0.5">
      <span className="text-signal-red shrink-0">✗</span>
      <span className="text-base-400 shrink-0">{rowLabel}</span>
      <span className="text-signal-red/90 truncate">
        order {orderId} — {firstIssue?.field}: {firstIssue?.message}
        {entry.issues.length > 1 ? ` (+${entry.issues.length - 1} more)` : ""}
      </span>
    </div>
  );
}
