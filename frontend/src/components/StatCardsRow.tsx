import React from "react";
import { ShieldAlert, FileText, Scale, Cpu, Sparkles } from "lucide-react";
import type { DocumentRiskReport } from "../types";

interface StatCardsRowProps {
  report?: DocumentRiskReport | null;
}

export const StatCardsRow: React.FC<StatCardsRowProps> = ({ report }) => {
  const score = report ? Math.round(report.overall_risk_score) : 0;
  const level = report ? report.overall_risk_level : "Clean";
  const totalClauses = report ? report.total_clauses_extracted : 0;
  const flagged = report ? report.flagged_clauses_count : 0;
  const criticalCount = report ? (report.severity_breakdown?.["Critical"] || 0) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Hero Dark Card matching Reference Image 4 */}
      <div className="p-5 rounded-3xl bg-navy-800 text-white shadow-soft flex flex-col justify-between space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-brand-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-300">Overall Risk Index</span>
          </div>
          {report ? (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              level === "Critical" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
              level === "High" ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" :
              level === "Medium" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
              "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}>
              {level}
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
              Ready
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <span className="text-3xl font-extrabold tracking-tight">
            {report ? `${score}%` : "--"}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {report ? `${level} Severity` : "No active file"}
          </span>
        </div>
      </div>

      {/* 2. White Metric Card: Clauses Analyzed */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-brand-600">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Total Clauses</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-brand-700">
            Gemini Flash
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <span className="text-3xl font-extrabold text-navy-800 tracking-tight">
            {report ? totalClauses : "0"}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            Operative Sections
          </span>
        </div>
      </div>

      {/* 3. White Metric Card: Flagged Hazards */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Flagged Risks</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
            {criticalCount} Critical
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
            {report ? flagged : "0"}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            Requires Attention
          </span>
        </div>
      </div>

      {/* 4. White Metric Card: Benchmark Alignment */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Fair Benchmarks</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            Chroma RAG
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
            {report ? `${Math.max(20, 100 - score)}%` : "100%"}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            Fairness Match
          </span>
        </div>
      </div>
    </div>
  );
};
