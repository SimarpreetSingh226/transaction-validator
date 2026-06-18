import { useConfig } from "../../context/ConfigContext.jsx";
import { useValidationContext } from "../../context/ValidationContext.jsx";
import { useChunkedExport } from "../../hooks/useChunkedExport.js";
import { Card, CardHeader, CardBody } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { ChunkList } from "./ChunkList.jsx";
import { formatNumber } from "../../utils/fileSizeFormat.js";

export function ExportPanel() {
  const { chunkSize, setChunkSize } = useConfig();
  const { results, fileMeta } = useValidationContext();
  const {
    cleanedRows,
    previewChunks,
    recommendedChunkSize,
    isExporting,
    includeInvalid,
    setIncludeInvalid,
    exportSingleFile,
    exportAsZip,
  } = useChunkedExport(results, chunkSize, fileMeta);

  if (!results) return null;

  return (
    <Card>
      <CardHeader>
        <h3 className="font-display font-medium text-sm text-base-100">
          Export cleaned dataset
        </h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <label className="flex items-center gap-2 text-xs font-mono text-base-300 cursor-pointer">
          <input
            type="checkbox"
            checked={includeInvalid}
            onChange={(e) => setIncludeInvalid(e.target.checked)}
            className="accent-signal-amber w-4 h-4"
          />
          include failed rows in export (flagged, unnormalized)
        </label>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-base-400">
              rows per chunk
            </span>
            <span className="text-xs font-mono text-base-500">
              recommended: {formatNumber(recommendedChunkSize)}
            </span>
          </div>
          <input
            type="range"
            min="500"
            max="20000"
            step="500"
            value={chunkSize}
            onChange={(e) => setChunkSize(Number(e.target.value))}
            className="w-full accent-signal-amber"
          />
          <div className="flex items-center justify-between text-xs font-mono text-base-300 mt-1">
            <span>{formatNumber(chunkSize)} rows/file</span>
            <span>
              {previewChunks.length} file{previewChunks.length !== 1 ? "s" : ""}{" "}
              total
            </span>
          </div>
        </div>

        <ChunkList chunks={previewChunks} />

        <div className="flex gap-2 pt-1">
          <Button
            variant="success"
            onClick={previewChunks.length > 1 ? exportAsZip : exportSingleFile}
            disabled={isExporting || cleanedRows.length === 0}
            className="flex-1"
          >
            {isExporting
              ? "preparing…"
              : previewChunks.length > 1
                ? `download ${previewChunks.length} files (.zip)`
                : "download cleaned .csv"}
          </Button>
        </div>
        <p className="text-xs text-base-500 font-mono">
          {formatNumber(cleanedRows.length)} rows will be exported
        </p>
      </CardBody>
    </Card>
  );
}
