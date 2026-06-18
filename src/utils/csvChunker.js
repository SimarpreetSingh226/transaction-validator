import { toCSV } from "./csvWriter.js";

/**
 * Splits rows into chunks of `chunkSize` rows each and returns an array
 * of { filename, content } CSV chunk objects. Used so very large datasets
 * can be downloaded/processed in manageable pieces instead of one giant file.
 */
export function chunkRowsToCSV(
  rows,
  columns,
  { chunkSize = 5000, baseName = "cleaned_transactions" } = {},
) {
  if (rows.length <= chunkSize) {
    return [
      {
        filename: `${baseName}.csv`,
        content: toCSV(rows, columns),
        rowCount: rows.length,
      },
    ];
  }

  const chunks = [];
  const totalChunks = Math.ceil(rows.length / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const slice = rows.slice(start, start + chunkSize);
    const partLabel = String(i + 1).padStart(String(totalChunks).length, "0");
    chunks.push({
      filename: `${baseName}_part${partLabel}_of_${totalChunks}.csv`,
      content: toCSV(slice, columns),
      rowCount: slice.length,
    });
  }

  return chunks;
}

/** Estimates the recommended chunk size based on a rough byte-per-row guess. */
export function suggestChunkSize(
  totalRows,
  targetBytesPerFile = 5 * 1024 * 1024,
  avgBytesPerRow = 180,
) {
  const rowsPerFile = Math.floor(targetBytesPerFile / avgBytesPerRow);
  return Math.max(1000, Math.min(rowsPerFile, totalRows));
}
