import { useRef } from "react";
import { useFileUpload } from "../../hooks/useFileUpload.js";
import { useValidationContext } from "../../context/ValidationContext.jsx";
import { formatBytes } from "../../utils/fileSizeFormat.js";

export function Dropzone() {
  const { isDragging, error, onDrop, onDragOver, onDragLeave, onSelectFile } =
    useFileUpload();
  const { fileMeta, reset } = useValidationContext();
  const inputRef = useRef(null);

  if (fileMeta) {
    return (
      <div className="border border-base-600 bg-base-800 rounded-lg px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-base-700 flex items-center justify-center text-signal-green font-mono text-xs">
            CSV
          </div>
          <div>
            <div className="font-mono text-sm text-base-100">
              {fileMeta.name}
            </div>
            <div className="text-xs text-base-400 font-mono">
              {formatBytes(fileMeta.size)}
            </div>
          </div>
        </div>
        <button
          onClick={reset}
          className="text-xs font-mono text-base-400 hover:text-signal-red transition-colors"
        >
          remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg px-6 py-14 text-center cursor-pointer transition-colors overflow-hidden ${
          isDragging
            ? "border-signal-amber bg-signal-amber/5"
            : "border-base-600 hover:border-base-500 bg-base-800/50"
        }`}
      >
        {isDragging && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-px bg-signal-amber/60 animate-scan absolute" />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={onSelectFile}
          className="hidden"
        />
        <div className="font-mono text-sm text-base-300 mb-2">
          drop transaction CSV here, or{" "}
          <span className="text-signal-amber">browse</span>
        </div>
        <div className="text-xs text-base-500 font-mono">
          order · product · payment fields, combined or separate exports —
          single .csv up to several hundred MB
        </div>
      </div>
      {error && (
        <p className="text-xs font-mono text-signal-red mt-2">{error}</p>
      )}
    </div>
  );
}
