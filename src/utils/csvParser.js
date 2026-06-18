import { normalizeHeader } from "../config/fieldSchema.js";

/**
 * Parses CSV text into { headers, rows }. Supports quoted fields with
 * embedded commas/newlines, and sniffs comma vs semicolon delimiter.
 */
export function parseCSV(text) {
  const cleanText = text.replace(/^\uFEFF/, ""); // strip BOM
  const delimiter = sniffDelimiter(cleanText);
  const records = parseRecords(cleanText, delimiter);

  if (records.length === 0) {
    return { headers: [], rows: [], rawHeaders: [] };
  }

  const rawHeaders = records[0].map((h) => h.trim());
  const headers = rawHeaders.map(normalizeHeader);

  const rows = records
    .slice(1)
    .filter((rec) => rec.some((cell) => cell.trim() !== ""))
    .map((rec) => {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = rec[idx] !== undefined ? rec[idx] : "";
      });
      return row;
    });

  return { headers, rows, rawHeaders };
}

function sniffDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || "";
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  return semiCount > commaCount ? ";" : ",";
}

function parseRecords(text, delimiter) {
  const records = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const len = text.length;

  while (i < len) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += char;
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (char === delimiter) {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (char === "\r") {
      i++;
      continue;
    }
    if (char === "\n") {
      row.push(field);
      records.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += char;
    i++;
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    records.push(row);
  }

  return records;
}
