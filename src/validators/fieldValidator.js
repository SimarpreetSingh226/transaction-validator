import { CURRENCY_CODES } from "../config/fieldSchema.js";

/**
 * Generic per-field integrity check driven by the field's schema entry.
 * Phone and date/time fields are validated by their dedicated validators
 * (called separately in rowValidator) — this handles everything else:
 * required-ness, type coercion, numeric ranges, enums, currency codes.
 */
export function validateField(value, fieldDef) {
  const trimmed = value == null ? "" : String(value).trim();

  if (fieldDef.required && trimmed === "") {
    return { valid: false, message: `${fieldDef.label} is required` };
  }
  if (!fieldDef.required && trimmed === "") {
    return { valid: true, message: "" };
  }

  switch (fieldDef.type) {
    case "string":
      return { valid: true, message: "" };

    case "integer": {
      if (!/^-?\d+$/.test(trimmed)) {
        return {
          valid: false,
          message: `${fieldDef.label} must be a whole number`,
        };
      }
      const num = Number(trimmed);
      if (fieldDef.min !== undefined && num < fieldDef.min) {
        return {
          valid: false,
          message: `${fieldDef.label} must be at least ${fieldDef.min}`,
        };
      }
      return { valid: true, message: "" };
    }

    case "decimal": {
      if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
        return {
          valid: false,
          message: `${fieldDef.label} must be a valid number`,
        };
      }
      const num = Number(trimmed);
      if (fieldDef.min !== undefined && num < fieldDef.min) {
        return {
          valid: false,
          message: `${fieldDef.label} must be at least ${fieldDef.min}`,
        };
      }
      return { valid: true, message: "" };
    }

    case "enum": {
      const normalized = trimmed.toLowerCase();
      if (!fieldDef.allowed.includes(normalized)) {
        return {
          valid: false,
          message: `${fieldDef.label} "${trimmed}" is not one of: ${fieldDef.allowed.join(", ")}`,
        };
      }
      return { valid: true, message: "" };
    }

    case "currency": {
      if (!CURRENCY_CODES.includes(trimmed.toUpperCase())) {
        return {
          valid: false,
          message: `"${trimmed}" is not a recognized currency code`,
        };
      }
      return { valid: true, message: "" };
    }

    default:
      return { valid: true, message: "" };
  }
}

/**
 * Checks for column presence / unexpected blank header row, used once
 * per uploaded file ahead of row-by-row validation.
 */
export function validateHeaders(headers, schemaFields) {
  const missing = schemaFields
    .filter((f) => f.required)
    .filter((f) => !headers.includes(f.key));
  return {
    valid: missing.length === 0,
    missingColumns: missing.map((f) => f.key),
  };
}
