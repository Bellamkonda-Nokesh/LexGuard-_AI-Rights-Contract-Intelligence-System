import { useState } from "react";
import type { DocumentRiskReport } from "../types";
import { RiskGauge } from "./RiskGauge";
import { ClauseCard } from "./ClauseCard";
import { ExplainabilityPanel } from "./ExplainabilityPanel";
import { 
  Download, 
  ArrowLeft, 
  Search 
} from "lucide-react";

interface ResultsDashboardProps {
  report: DocumentRiskReport;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  report,
  onReset,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter clauses
  const filteredClauses = report.clauses.filter((c) => {
    if (selectedSeverity !== "all" && c.severity.toLowerCase() !== selectedSeverity.toLowerCase()) {
      return false;
    }
    if (selectedCategory !== "all" && c.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.original_text.toLowerCase().includes(q) ||
        c.plain_explanation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `LexGuard_Report_${report.document_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Another Document</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export Report (JSON)</span>
          </button>
        </div>
      </div>

      {/* Document Overview & File Identity */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100/80 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
            {report.file_type || "DOC"}
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              {report.filename}
            </h1>
            <p className="text-xs text-slate-500">
              Analyzed on {report.uploaded_at?.slice(0, 10)} • Processed in {report.processing_time_seconds}s
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Total Clauses</span>
            <span className="text-slate-900 dark:text-white text-sm">{report.total_clauses_extracted}</span>
          </div>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Flagged Risks</span>
            <span className="text-red-600 text-sm font-bold">{report.flagged_clauses_count}</span>
          </div>
        </div>
      </div>

      {/* Risk Gauge & Executive Summary */}
      <RiskGauge
        score={report.overall_risk_score}
        level={report.overall_risk_level}
        headline={report.summary_headline}
        executiveSummary={report.executive_summary}
        totalClauses={report.total_clauses_extracted}
        flaggedClauses={report.flagged_clauses_count}
        severityBreakdown={report.severity_breakdown}
      />

      {/* Explainable AI Trace Panel */}
      <ExplainabilityPanel
        traces={report.agent_traces}
        processingTimeSeconds={report.processing_time_seconds}
      />

      {/* Clauses Section */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Flagged Contract Clauses ({filteredClauses.length})
            </h2>
            <p className="text-xs text-slate-500">
              Sorted by severity rating. Expand each clause to inspect plain-language interpretations, fair benchmarks, and redline counter-language.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clauses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Severity and Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Severity:
          </span>
          {["all", "critical", "high", "medium", "low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                selectedSeverity === sev
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
              }`}
            >
              {sev}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2 hidden sm:block" />

          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Category:
          </span>
          {["all", "employment", "subscription", "tos", "vendor", "rental"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List of Clauses */}
        {filteredClauses.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            No clauses match the selected filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClauses.map((clause, idx) => (
              <ClauseCard key={clause.clause_id || idx} clause={clause} index={idx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
