import { createContext, useContext, useState, useCallback } from "react";
import { DEFAULT_COUNTRY_PHONE_RULES } from "../config/countryPhoneRules.js";
import { DEFAULT_DATE_FORMATS } from "../config/dateFormats.js";

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [countryRules, setCountryRules] = useState(DEFAULT_COUNTRY_PHONE_RULES);
  const [dateFormats, setDateFormats] = useState(DEFAULT_DATE_FORMATS);
  const [chunkSize, setChunkSize] = useState(5000);

  const updateCountryRule = useCallback((code, patch) => {
    setCountryRules((prev) =>
      prev.map((r) => (r.code === code ? { ...r, ...patch } : r)),
    );
  }, []);

  const addCountryRule = useCallback((rule) => {
    setCountryRules((prev) => [...prev, rule]);
  }, []);

  const removeCountryRule = useCallback((code) => {
    setCountryRules((prev) => prev.filter((r) => r.code !== code));
  }, []);

  const toggleDateFormat = useCallback((id) => {
    setDateFormats((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)),
    );
  }, []);

  const value = {
    countryRules,
    setCountryRules,
    updateCountryRule,
    addCountryRule,
    removeCountryRule,
    dateFormats,
    setDateFormats,
    toggleDateFormat,
    chunkSize,
    setChunkSize,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}
