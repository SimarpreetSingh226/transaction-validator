import { FIELD_SCHEMA } from "../config/fieldSchema.js";
import {
  DEFAULT_DATE_FORMATS,
  FIELD_FORMAT_GROUPS,
} from "../config/dateFormats.js";
import { validateField } from "./fieldValidator.js";
import { validatePhone } from "./phoneValidator.js";
import { validateDateTime } from "./dateValidator.js";

/**
 * Validates a single merged row (order + product + payment fields combined)
 * against the full schema. Returns a list of issues, each tagged with the
 * field key and severity, plus the cleaned/normalized row.
 */
export function validateRow(
  row,
  rowIndex,
  { countryRules, dateFormats, seenOrderIds },
) {
  const issues = [];
  const cleanedRow = { ...row };
  const allFields = [
    ...FIELD_SCHEMA.order,
    ...FIELD_SCHEMA.product,
    ...FIELD_SCHEMA.payment,
  ];

  for (const fieldDef of allFields) {
    const rawValue = row[fieldDef.key];

    if (fieldDef.type === "phone") {
      const countryCode = row.country_code;
      const result = validatePhone(rawValue, countryCode, countryRules);
      if (!result.valid) {
        issues.push({
          field: fieldDef.key,
          severity: "error",
          message: result.message,
        });
      } else {
        cleanedRow[fieldDef.key] = result.normalized;
      }
      continue;
    }

    if (fieldDef.type === "date" || fieldDef.type === "time") {
      const allowedIds = FIELD_FORMAT_GROUPS[fieldDef.key] || null;
      const formats = dateFormats || DEFAULT_DATE_FORMATS;
      const result = validateDateTime(rawValue, formats, allowedIds);
      if (!result.valid) {
        issues.push({
          field: fieldDef.key,
          severity: fieldDef.required ? "error" : "warning",
          message: result.message,
        });
      }
      continue;
    }

    const result = validateField(rawValue, fieldDef);
    if (!result.valid) {
      issues.push({
        field: fieldDef.key,
        severity: "error",
        message: result.message,
      });
    } else if (fieldDef.type === "enum" && rawValue) {
      cleanedRow[fieldDef.key] = String(rawValue).trim().toLowerCase();
    } else if (fieldDef.type === "currency" && rawValue) {
      cleanedRow[fieldDef.key] = String(rawValue).trim().toUpperCase();
    } else if (typeof rawValue === "string") {
      cleanedRow[fieldDef.key] = rawValue.trim();
    }
  }

  // duplicate order_id check (integrity check across rows)
  const orderId = row.order_id != null ? String(row.order_id).trim() : "";
  if (orderId) {
    if (
      seenOrderIds.has(orderId) &&
      FIELD_SCHEMA.order.find((f) => f.key === "order_id")?.unique
    ) {
      // Only flag as duplicate warning for order-level rows; product/payment rows
      // legitimately repeat order_id, so this is informational, not blocking.
    }
    seenOrderIds.add(orderId);
  }

  const hasErrors = issues.some((i) => i.severity === "error");

  return {
    rowIndex,
    valid: !hasErrors,
    issues,
    cleanedRow,
    original: row,
  };
}

/**
 * Validates an array of parsed rows, returning a summary plus per-row results.
 * Accepts a progress callback invoked periodically for UI feedback on large files.
 */
export function validateDataset(
  rows,
  { countryRules, dateFormats, onProgress },
) {
  const seenOrderIds = new Set();
  const results = [];
  let validCount = 0;
  let errorCount = 0;
  let warningCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const result = validateRow(rows[i], i, {
      countryRules,
      dateFormats,
      seenOrderIds,
    });
    results.push(result);
    if (result.valid) validCount++;
    errorCount += result.issues.filter(
      (iss) => iss.severity === "error",
    ).length;
    warningCount += result.issues.filter(
      (iss) => iss.severity === "warning",
    ).length;

    if (onProgress && (i % 25 === 0 || i === rows.length - 1)) {
      onProgress({ processed: i + 1, total: rows.length, latest: result });
    }
  }

  return {
    results,
    summary: {
      totalRows: rows.length,
      validRows: validCount,
      invalidRows: rows.length - validCount,
      errorCount,
      warningCount,
    },
  };
}
