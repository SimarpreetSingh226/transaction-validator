import { useValidation } from "../../hooks/useValidation.js";
import { StatCard } from "../ui/StatCard.jsx";
import { formatNumber } from "../../utils/fileSizeFormat.js";

export function ValidationSummary() {
  const { summary } = useValidation();
  if (!summary) return null;

  const passRate = summary.totalRows
    ? Math.round((summary.validRows / summary.totalRows) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Total rows" value={formatNumber(summary.totalRows)} />
      <StatCard
        label="Passed"
        value={formatNumber(summary.validRows)}
        accent="text-signal-green"
        sub={`${passRate}% clean`}
      />
      <StatCard
        label="Failed"
        value={formatNumber(summary.invalidRows)}
        accent="text-signal-red"
      />
      <StatCard
        label="Warnings"
        value={formatNumber(summary.warningCount)}
        accent="text-signal-amber"
      />
    </div>
  );
}
