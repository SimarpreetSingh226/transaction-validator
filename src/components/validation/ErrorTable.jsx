import { useState } from "react";
import { useValidation } from "../../hooks/useValidation.js";
import { Card, CardHeader, CardBody } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";

export function ErrorTable() {
  const { invalidRows, errorsByField } = useValidation();
  const [filterField, setFilterField] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  if (invalidRows.length === 0) return null;

  const filtered = filterField
    ? invalidRows.filter((r) => r.issues.some((i) => i.field === filterField))
    : invalidRows;

  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-display font-medium text-sm text-base-100">
          Failed rows
        </h3>
        <Badge variant="fail">
          {invalidRows.length.toLocaleString()} rows need attention
        </Badge>
      </CardHeader>
      <CardBody>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => {
              setFilterField(null);
              setPage(0);
            }}
            className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
              !filterField
                ? "border-signal-amber text-signal-amber"
                : "border-base-600 text-base-400 hover:text-base-200"
            }`}
          >
            all fields
          </button>
          {errorsByField.map(({ field, count }) => (
            <button
              key={field}
              onClick={() => {
                setFilterField(field);
                setPage(0);
              }}
              className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                filterField === field
                  ? "border-signal-amber text-signal-amber"
                  : "border-base-600 text-base-400 hover:text-base-200"
              }`}
            >
              {field} ({count})
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-base-600 text-base-400">
                <th className="text-left py-2 pr-3 font-medium">Row</th>
                <th className="text-left py-2 pr-3 font-medium">Order ID</th>
                <th className="text-left py-2 font-medium">Issues</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr
                  key={r.rowIndex}
                  className="border-b border-base-700/60 last:border-0 align-top"
                >
                  <td className="py-2 pr-3 text-base-400 whitespace-nowrap">
                    {r.rowIndex + 1}
                  </td>
                  <td className="py-2 pr-3 text-base-200 whitespace-nowrap">
                    {r.original.order_id || "—"}
                  </td>
                  <td className="py-2 space-y-1">
                    {r.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Badge
                          variant={issue.severity === "error" ? "fail" : "warn"}
                          className="shrink-0"
                        >
                          {issue.field}
                        </Badge>
                        <span className="text-base-300">{issue.message}</span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-xs font-mono text-base-400">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-2 py-1 rounded hover:bg-base-700 disabled:opacity-30"
            >
              ← prev
            </button>
            <span>
              page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-2 py-1 rounded hover:bg-base-700 disabled:opacity-30"
            >
              next →
            </button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
