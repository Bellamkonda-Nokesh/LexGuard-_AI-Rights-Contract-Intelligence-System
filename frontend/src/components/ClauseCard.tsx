import React, { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Scale, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  HelpCircle 
} from "lucide-react";
import type { ClauseAnalysis } from "../types";
import { formatSeverityColor } from "../lib/utils";

interface ClauseCardProps {
  clause: ClauseAnalysis;
  index: number;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({ clause, index }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedRedline, setCopiedRedline] = useState(false);

  const sevColor = formatSeverityColor(clause.severity);

  const handleCopyOriginal = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(clause.original_text);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const handleCopyRedline = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clause.negotiation_recommendation) {
      navigator.clipboard.writeText(clause.negotiation_recommendation);
      setCopiedRedline(true);
      setTimeout(() => setCopiedRedline(false), 2000);
    }
  };

  return (
    <article
      className={`border rounded-2xl bg-white dark:bg-slate-900 transition-all ${
        isExpanded 
          ? "border-blue-400 dark:border-blue-600 shadow-md ring-1 ring-blue-500/20" 
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
      }`}
      aria-labelledby={`clause-title-${clause.clause_id}`}
    >
      {/* Header bar / clickable trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`clause-content-${clause.clause_id}`}
        className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
      >
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Severity Pill */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${sevColor.badge}`}
            >
              {clause.severity} Risk ({clause.risk_score}/100)
            </span>

            {/* Category Tag */}
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
              {clause.category.replace("_", " ")}
            </span>

            {clause.page_number && (
              <span className="text-[11px] text-slate-400 font-medium">
                Page {clause.page_number}
              </span>
            )}
          </div>

          <h3 
            id={`clause-title-${clause.clause_id}`}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-white"
          >
            {clause.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
            <strong>Plain English:</strong> {clause.plain_explanation}
          </p>
        </div>

        <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div 
          id={`clause-content-${clause.clause_id}`}
          className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-5"
        >
          {/* Section 1: Original Verbatim Clause */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Original Contract Clause:
              </span>
              <button
                type="button"
                onClick={handleCopyOriginal}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                aria-label="Copy verbatim clause text"
              >
                {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOriginal ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {clause.original_text}
            </div>
          </div>

          {/* Section 2: Plain Language Translation & Rationale */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-bold text-xs uppercase tracking-wide">
                <HelpCircle className="w-4 h-4" />
                <span>What This Means For You (Plain English)</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-950 dark:text-blue-100 leading-relaxed">
                {clause.plain_explanation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4" />
                <span>Risk Rationale & Real-World Impact</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 leading-relaxed">
                {clause.risk_rationale}
              </p>
            </div>
          </div>

          {/* Section 3: Hidden Liabilities & Ambiguities */}
          {(clause.hidden_liabilities?.length > 0 || clause.ambiguities_or_contradictions?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {clause.hidden_liabilities?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Hidden Liabilities Detected:</span>
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                    {clause.hidden_liabilities.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {clause.ambiguities_or_contradictions?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Ambiguous / Contradictory Terms:</span>
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                    {clause.ambiguities_or_contradictions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Fair Benchmark Comparison */}
          {clause.benchmark_comparison && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Standard Fair Clause Benchmark: {clause.benchmark_comparison.title}</span>
                </div>
                {clause.benchmark_comparison.similarity_score && (
                  <span className="text-[11px] font-semibold text-slate-500">
                    Match: {Math.round(clause.benchmark_comparison.similarity_score * 100)}%
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-750">
                "{clause.benchmark_comparison.standard_clause_text}"
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                <strong>Why this is fair:</strong> {clause.benchmark_comparison.fairness_rationale}
              </p>
            </div>
          )}

          {/* Section 5: Negotiation Redline Recommendation */}
          {clause.negotiation_recommendation && (
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200 font-bold text-xs uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Suggested Negotiation Language (Counter-Redline)</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyRedline}
                  className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300 hover:underline font-semibold"
                  aria-label="Copy redline counter-proposal"
                >
                  {copiedRedline ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRedline ? "Copied" : "Copy Counter-Proposal"}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 font-medium leading-relaxed bg-white/70 dark:bg-emerald-900/30 p-3 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
                {clause.negotiation_recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
