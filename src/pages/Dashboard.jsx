import { useState } from "react";
import { useValidationContext, STAGE } from "../context/ValidationContext.jsx";
import { Dropzone } from "../components/upload/Dropzone.jsx";
import { FilePreviewTable } from "../components/upload/FilePreviewTable.jsx";
import { CountryRulesPanel } from "../components/config/CountryRulesPanel.jsx";
import { DateFormatPanel } from "../components/config/DateFormatPanel.jsx";
import { ValidationSummary } from "../components/validation/ValidationSummary.jsx";
import { ValidationLedger } from "../components/validation/ValidationLedger.jsx";
import { ErrorTable } from "../components/validation/ErrorTable.jsx";
import { ExportPanel } from "../components/export/ExportPanel.jsx";
import { Button } from "../components/ui/Button.jsx";

const TABS = [
  { id: "rules", label: "Phone rules" },
  { id: "formats", label: "Date formats" },
];

export function Dashboard() {
  const { stage, parsed, runValidation } = useValidationContext();
  const [activeTab, setActiveTab] = useState("rules");

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4">
          <h2 className="font-display font-semibold text-xl text-base-100 tracking-tightest">
            Upload transaction dataset
          </h2>
          <p className="text-sm text-base-400 mt-1">
            Combine order, product, and payment-mode fields in a single CSV —
            country-driven phone checks, format-driven date validation, and
            integrity checks run entirely client-side.
          </p>
        </div>
        <Dropzone />
      </section>

      {parsed && parsed.rows.length > 0 && (
        <section className="space-y-4">
          <FilePreviewTable />
        </section>
      )}

      {parsed && (
        <section>
          <div className="mb-4 flex items-center gap-1 border-b border-base-600">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-display font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-signal-amber text-base-100"
                    : "border-transparent text-base-400 hover:text-base-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab === "rules" && <CountryRulesPanel />}
          {activeTab === "formats" && <DateFormatPanel />}
        </section>
      )}

      {parsed && stage !== STAGE.VALIDATING && (
        <section className="flex items-center gap-3">
          <Button onClick={runValidation} disabled={stage === STAGE.VALIDATING}>
            run validation on {parsed.rows.length.toLocaleString()} rows
          </Button>
          {stage === STAGE.DONE && (
            <span className="text-xs font-mono text-base-400">
              re-run after adjusting rules or formats above
            </span>
          )}
        </section>
      )}

      {(stage === STAGE.VALIDATING || stage === STAGE.DONE) && (
        <section className="space-y-6">
          <ValidationLedger />
          {stage === STAGE.DONE && (
            <>
              <ValidationSummary />
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ErrorTable />
                </div>
                <div>
                  <ExportPanel />
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
