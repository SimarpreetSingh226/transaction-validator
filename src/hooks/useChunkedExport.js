import { useState, useCallback, useMemo } from "react";
import { collectColumns } from "../utils/csvWriter.js";
import { chunkRowsToCSV, suggestChunkSize } from "../utils/csvChunker.js";
import { downloadTextFile, downloadAsZip } from "../utils/downloadFile.js";
import { formatBytes } from "../utils/fileSizeFormat.js";

export function useChunkedExport(results, chunkSize, fileMeta) {
  const [isExporting, setIsExporting] = useState(false);
  const [includeInvalid, setIncludeInvalid] = useState(false);

  const cleanedRows = useMemo(() => {
    if (!results) return [];
    const subset = includeInvalid ? results : results.filter((r) => r.valid);
    return subset.map((r) => r.cleanedRow);
  }, [results, includeInvalid]);

  const columns = useMemo(() => collectColumns(cleanedRows), [cleanedRows]);

  const recommendedChunkSize = useMemo(
    () => suggestChunkSize(cleanedRows.length),
    [cleanedRows.length],
  );

  const previewChunks = useMemo(() => {
    if (cleanedRows.length === 0) return [];
    return chunkRowsToCSV(cleanedRows, columns, {
      chunkSize,
      baseName:
        (fileMeta?.name || "transactions").replace(/\.csv$/i, "") + "_cleaned",
    }).map((c) => ({
      ...c,
      sizeLabel: formatBytes(new Blob([c.content]).size),
    }));
  }, [cleanedRows, columns, chunkSize, fileMeta]);

  const exportSingleFile = useCallback(() => {
    if (previewChunks.length === 0) return;
    setIsExporting(true);
    try {
      if (previewChunks.length === 1) {
        downloadTextFile(previewChunks[0].filename, previewChunks[0].content);
      } else {
        previewChunks.forEach((chunk) =>
          downloadTextFile(chunk.filename, chunk.content),
        );
      }
    } finally {
      setIsExporting(false);
    }
  }, [previewChunks]);

  const exportAsZip = useCallback(async () => {
    if (previewChunks.length === 0) return;
    setIsExporting(true);
    try {
      await downloadAsZip(
        previewChunks,
        `${(fileMeta?.name || "transactions").replace(/\.csv$/i, "")}_cleaned_chunks.zip`,
      );
    } finally {
      setIsExporting(false);
    }
  }, [previewChunks, fileMeta]);

  return {
    cleanedRows,
    columns,
    previewChunks,
    recommendedChunkSize,
    isExporting,
    includeInvalid,
    setIncludeInvalid,
    exportSingleFile,
    exportAsZip,
  };
}
