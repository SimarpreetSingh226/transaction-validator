import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { parseCSV } from "../utils/csvParser.js";
import { validateRow } from "../validators/rowValidator.js";
import { useConfig } from "./ConfigContext.jsx";

const ValidationContext = createContext(null);

export const STAGE = {
  IDLE: "idle",
  PARSED: "parsed",
  VALIDATING: "validating",
  DONE: "done",
};

export function ValidationProvider({ children }) {
  const { countryRules, dateFormats } = useConfig();
  const [stage, setStage] = useState(STAGE.IDLE);
  const [fileMeta, setFileMeta] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [liveFeed, setLiveFeed] = useState([]);
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const cancelRef = useRef(false);

  const loadFile = useCallback((file, text) => {
    setFileMeta({
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
    });
    const { headers, rows, rawHeaders } = parseCSV(text);
    setParsed({ headers, rows, rawHeaders });
    setStage(STAGE.PARSED);
    setResults(null);
    setSummary(null);
    setLiveFeed([]);
  }, []);

  const runValidation = useCallback(async () => {
    if (!parsed) return;
    setStage(STAGE.VALIDATING);
    setProgress({ processed: 0, total: parsed.rows.length });
    setLiveFeed([]);
    cancelRef.current = false;

    // Run in chunks via setTimeout so the UI can paint progress / live feed
    // for large files instead of blocking the main thread in one go.
    const CHUNK = 200;
    const allResults = [];
    let validCount = 0;
    let errorCount = 0;
    let warningCount = 0;
    const seenOrderIds = new Set();

    const rows = parsed.rows;
    let i = 0;

    await new Promise((resolve) => {
      const step = () => {
        if (cancelRef.current) return resolve();
        const end = Math.min(i + CHUNK, rows.length);
        const batch = [];
        for (; i < end; i++) {
          const r = validateRow(rows[i], i, {
            countryRules,
            dateFormats,
            seenOrderIds,
          });
          allResults.push(r);
          batch.push(r);
          if (r.valid) validCount++;
          errorCount += r.issues.filter(
            (iss) => iss.severity === "error",
          ).length;
          warningCount += r.issues.filter(
            (iss) => iss.severity === "warning",
          ).length;
        }
        setProgress({ processed: i, total: rows.length });
        setLiveFeed((prev) => {
          const next = [...prev, ...batch.slice(-3)];
          return next.slice(-40);
        });

        if (i < rows.length) {
          setTimeout(step, 0);
        } else {
          resolve();
        }
      };
      step();
    });

    setResults(allResults);
    setSummary({
      totalRows: rows.length,
      validRows: validCount,
      invalidRows: rows.length - validCount,
      errorCount,
      warningCount,
    });
    setStage(STAGE.DONE);
  }, [parsed, countryRules, dateFormats]);

  const reset = useCallback(() => {
    setStage(STAGE.IDLE);
    setFileMeta(null);
    setParsed(null);
    setResults(null);
    setSummary(null);
    setLiveFeed([]);
    setProgress({ processed: 0, total: 0 });
  }, []);

  const value = {
    stage,
    fileMeta,
    parsed,
    progress,
    liveFeed,
    results,
    summary,
    loadFile,
    runValidation,
    reset,
  };

  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
}

export function useValidationContext() {
  const ctx = useContext(ValidationContext);
  if (!ctx)
    throw new Error(
      "useValidationContext must be used within ValidationProvider",
    );
  return ctx;
}
