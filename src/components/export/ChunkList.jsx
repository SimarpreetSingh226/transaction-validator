export function ChunkList({ chunks }) {
  if (chunks.length <= 1) return null;

  return (
    <div className="border border-base-600 rounded-md divide-y divide-base-700 max-h-48 overflow-y-auto">
      {chunks.map((chunk) => (
        <div
          key={chunk.filename}
          className="flex items-center justify-between px-3 py-2 text-xs font-mono"
        >
          <span className="text-base-200 truncate">{chunk.filename}</span>
          <span className="text-base-500 shrink-0 ml-3">
            {chunk.rowCount.toLocaleString()} rows · {chunk.sizeLabel}
          </span>
        </div>
      ))}
    </div>
  );
}
