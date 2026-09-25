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
      className={`rounded-3xl bg-white transition-all border ${
        isExpanded 
          ? "border-brand-200 shadow-soft" 
          : "border-slate-100 hover:border-slate-200 hover:shadow-soft-sm"
      }`}
      aria-labelledby={`clause-title-${clause.clause_id}`}
    >
      {/* Header bar / Clickable trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`clause-content-${clause.clause_id}`}
        className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
      >
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Severity Badge */}
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${sevColor.badge} flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sevColor.indicator}`} />
              <span>{clause.severity} Risk ({clause.risk_score}/100)</span>
            </span>

            {/* Category Tag */}
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 capitalize">
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
            className="text-base sm:text-lg font-extrabold text-navy-800 tracking-tight"
          >
            {clause.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
            <strong className="text-navy-800">Plain English:</strong> {clause.plain_explanation}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-100 shrink-0">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div 
          id={`clause-content-${clause.clause_id}`}
          className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-5"
        >
          {/* Section 1: Original Verbatim Clause */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Original Verbatim Contract Text:
              </span>
              <button
                type="button"
                onClick={handleCopyOriginal}
                className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-bold"
                aria-label="Copy verbatim clause text"
              >
                {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOriginal ? "Copied" : "Copy Text"}</span>
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
              {clause.original_text}
            </div>
          </div>

          {/* Section 2: Plain Language Translation & Rationale */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-brand-700 font-bold text-xs uppercase tracking-wide">
                <HelpCircle className="w-4 h-4" />
                <span>What This Means For You (Plain English)</span>
              </div>
              <p className="text-xs sm:text-sm text-navy-800 leading-relaxed font-medium">
                {clause.plain_explanation}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4" />
                <span>Risk Rationale & Real-World Impact</span>
              </div>
              <p className="text-xs sm:text-sm text-navy-800 leading-relaxed font-medium">
                {clause.risk_rationale}
              </p>
            </div>
          </div>

          {/* Section 3: Hidden Liabilities & Ambiguities */}
          {(clause.hidden_liabilities?.length > 0 || clause.ambiguities_or_contradictions?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {clause.hidden_liabilities?.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                  <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Hidden Liabilities Detected:</span>
                  </span>
                  <ul className="space-y-1 text-xs text-rose-950 list-disc list-inside">
                    {clause.hidden_liabilities.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {clause.ambiguities_or_contradictions?.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ambiguous / Contradictory Terms:</span>
                  </span>
                  <ul className="space-y-1 text-xs text-amber-950 list-disc list-inside">
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
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy-800">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Standard Fair Benchmark: {clause.benchmark_comparison.title}</span>
                </div>
                {clause.benchmark_comparison.similarity_score && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Match: {Math.round(clause.benchmark_comparison.similarity_score * 100)}%
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-700 bg-white p-3 rounded-xl border border-slate-200/70">
                "{clause.benchmark_comparison.standard_clause_text}"
              </p>
              <p className="text-xs text-emerald-800 font-medium">
                <strong>Why this is fair:</strong> {clause.benchmark_comparison.fairness_rationale}
              </p>
            </div>
          )}

          {/* Section 5: Negotiation Redline Recommendation */}
          {clause.negotiation_recommendation && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Suggested Negotiation Language (Counter-Redline)</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyRedline}
                  className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs"
                  aria-label="Copy redline counter-proposal"
                >
                  {copiedRedline ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRedline ? "Copied" : "Copy Counter-Proposal"}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed bg-white p-3 rounded-xl border border-emerald-200/60">
                {clause.negotiation_recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
