import { useState } from "react";
import type { DocumentRiskReport } from "../types";
import { RiskGauge } from "./RiskGauge";
import { ClauseCard } from "./ClauseCard";
import { ExplainabilityPanel } from "./ExplainabilityPanel";
import { StatCardsRow } from "./StatCardsRow";
import { 
  Download, 
  ArrowLeft, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Scale, 
  CheckCircle2, 
  FileText,
  AlertCircle
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

  // Top critical and high clauses for the AI Insights panel
  const topCritical = report.clauses.filter(c => c.severity === "Critical" || c.severity === "High").slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Another Contract</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-700 bg-white hover:bg-brand-50 border border-slate-200 rounded-full shadow-soft-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-brand-600" />
            <span>Export Report (JSON)</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards matching Reference Image 4 */}
      <StatCardsRow report={report} />

      {/* Main Grid: Left (Gauge + Clauses) and Right (AI Insights Rail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Concentric Risk Gauge & Executive Summary */}
          <RiskGauge
            score={report.overall_risk_score}
            level={report.overall_risk_level}
            headline={report.summary_headline}
            executiveSummary={report.executive_summary}
            totalClauses={report.total_clauses_extracted}
            flaggedClauses={report.flagged_clauses_count}
            severityBreakdown={report.severity_breakdown}
          />

          {/* Flagged Clauses Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-navy-800 tracking-tight">
                  Flagged Contract Clauses ({filteredClauses.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Sorted by severity. Expand each clause to inspect fair benchmarks and redline proposals.
                </p>
              </div>

              {/* Search bar matching reference pill style */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search clauses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full bg-white border border-slate-200 text-navy-800 placeholder:text-slate-400 focus:border-brand-400 shadow-soft-sm"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Severity:
              </span>
              {["all", "critical", "high", "medium", "low"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                    selectedSeverity === sev
                      ? "bg-navy-800 text-white shadow-soft-sm"
                      : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  {sev}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block" />

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Category:
              </span>
              {["all", "employment", "subscription", "tos", "vendor", "rental"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                    selectedCategory === cat
                      ? "bg-brand-600 text-white shadow-soft-sm"
                      : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List of Clauses */}
            {filteredClauses.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 text-xs font-medium shadow-soft">
                No clauses match the selected filters.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredClauses.map((clause, idx) => (
                  <ClauseCard key={clause.clause_id || idx} clause={clause} index={idx} />
                ))}
              </div>
            )}
          </div>

          {/* Explainability Trace Panel */}
          <ExplainabilityPanel
            traces={report.agent_traces}
            processingTimeSeconds={report.processing_time_seconds}
          />
        </div>

        {/* Right Column: 4 Cols matching Reference Image 4 ("AI Insights") */}
        <div className="lg:col-span-4 space-y-6">
          {/* Document Identity Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Contract File
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs uppercase shrink-0">
                {report.file_type || "DOC"}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-navy-800 truncate" title={report.filename}>
                  {report.filename}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {report.total_clauses_extracted} clauses • {report.processing_time_seconds}s latency
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights Rail matching Reference Image 4 ("AI Insights") */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-navy-800 tracking-tight">
                AI Strategic Insights
              </h3>
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                Gemini 2.5
              </span>
            </div>

            <div className="space-y-3">
              {topCritical.length > 0 ? (
                topCritical.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                          c.severity === "Critical" ? "bg-rose-500" : "bg-orange-500"
                        }`}>
                          !
                        </div>
                        <span className="text-xs font-bold text-navy-800 line-clamp-1">
                          Risk Exposure: {c.title}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {c.plain_explanation}
                    </p>
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1">
                        <span>Risk Severity</span>
                        <span className={c.severity === "Critical" ? "text-rose-600 font-bold" : "text-orange-600 font-bold"}>
                          {Math.round(c.risk_score)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${c.severity === "Critical" ? "bg-rose-500" : "bg-orange-500"}`}
                          style={{ width: `${c.risk_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 font-medium">
                  No critical liabilities found. Contract appears balanced.
                </div>
              )}

              {/* RAG Benchmark Comparison Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold text-brand-800">
                    Chroma Vector RAG Audit
                  </span>
                </div>
                <p className="text-[11px] text-indigo-950 leading-relaxed">
                  Clauses evaluated against 8 standard balanced fair industry models with semantic vector embeddings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
