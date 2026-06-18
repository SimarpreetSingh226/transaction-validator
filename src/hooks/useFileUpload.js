import { useState, useCallback } from "react";
import { useValidationContext } from "../context/ValidationContext.jsx";

export function useFileUpload() {
  const { loadFile } = useValidationContext();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const processFile = useCallback(
    (file) => {
      setError(null);
      if (!file) return;
      if (!/\.csv$/i.test(file.name)) {
        setError("Only .csv files are supported right now.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          loadFile(file, e.target.result);
        } catch (err) {
          setError(`Could not parse file: ${err.message}`);
        }
      };
      reader.onerror = () => setError("Failed to read the file.");
      reader.readAsText(file);
    },
    [loadFile],
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      processFile(file);
    },
    [processFile],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onSelectFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      processFile(file);
    },
    [processFile],
  );

  return {
    isDragging,
    error,
    onDrop,
    onDragOver,
    onDragLeave,
    onSelectFile,
    processFile,
  };
}
