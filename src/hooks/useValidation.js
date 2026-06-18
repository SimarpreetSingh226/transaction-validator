import { useMemo } from "react";
import { useValidationContext } from "../context/ValidationContext.jsx";

export function useValidation() {
  const ctx = useValidationContext();

  const errorsByField = useMemo(() => {
    if (!ctx.results) return [];
    const counts = {};
    ctx.results.forEach((r) => {
      r.issues.forEach((iss) => {
        counts[iss.field] = (counts[iss.field] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([field, count]) => ({ field, count }))
      .sort((a, b) => b.count - a.count);
  }, [ctx.results]);

  const invalidRows = useMemo(() => {
    if (!ctx.results) return [];
    return ctx.results.filter((r) => !r.valid);
  }, [ctx.results]);

  const validRows = useMemo(() => {
    if (!ctx.results) return [];
    return ctx.results.filter((r) => r.valid);
  }, [ctx.results]);

  const progressPercent = ctx.progress.total
    ? Math.round((ctx.progress.processed / ctx.progress.total) * 100)
    : 0;

  return {
    ...ctx,
    errorsByField,
    invalidRows,
    validRows,
    progressPercent,
  };
}
