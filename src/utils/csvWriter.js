/**
 * Serializes an array of row objects into CSV text using the given
 * column order. Fields containing the delimiter, quotes, or newlines
 * are quoted and escaped per RFC 4180.
 */
export function toCSV(rows, columns) {
  const escapeField = (value) => {
    const str = value == null ? "" : String(value);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = columns.map(escapeField).join(",");
  const lines = rows.map((row) =>
    columns.map((col) => escapeField(row[col])).join(","),
  );

  return [headerLine, ...lines].join("\r\n");
}

export function collectColumns(rows) {
  const cols = new Set();
  rows.forEach((row) => Object.keys(row).forEach((k) => cols.add(k)));
  return Array.from(cols);
}
