import React from "react";
import type { SeverityLevel } from "../types";
import { formatSeverityColor } from "../lib/utils";
import { ShieldAlert, AlertCircle, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";

interface RiskGaugeProps {
  score: number;
  level: SeverityLevel;
  headline: string;
  executiveSummary: string;
  totalClauses: number;
  flaggedClauses: number;
  severityBreakdown: Record<string, number>;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  headline,
  executiveSummary,
  totalClauses,
  flaggedClauses,
  severityBreakdown,
}) => {
  const sevColor = formatSeverityColor(level);

  // SVG Gauge calculations
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-soft">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Modern Concentric Gauge matching Reference Image 4 */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-slate-50/60 rounded-3xl border border-slate-100">
          <div 
            className="relative flex items-center justify-center"
            role="meter"
            aria-label="Overall Document Risk Score"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${score} out of 100, ${level} Risk`}
          >
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 128 128">
              {/* Outer soft track */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-200/60"
                strokeWidth="8"
                fill="none"
              />
              {/* Dynamic Progress Stroke */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="currentColor"
                className={`transition-all duration-1000 ease-out ${
                  level === "Critical"
                    ? "text-rose-500"
                    : level === "High"
                    ? "text-orange-500"
                    : level === "Medium"
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Concentric inner circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-navy-800 tracking-tight">
                {Math.round(score)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Risk Score / 100
              </span>
            </div>
          </div>

          {/* Severity Badge */}
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sevColor.badge}`}>
              <span className={`w-2 h-2 rounded-full ${sevColor.indicator}`} />
              <span>{level.toUpperCase()} RISK</span>
            </span>
          </div>

          <div className="mt-2 text-[11px] font-medium text-slate-400">
            {flaggedClauses} of {totalClauses} clauses flagged
          </div>
        </div>

        {/* Right: Executive Risk Summary matching Reference Image 4 */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-brand-600 font-bold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 2.5 Pro Executive Synthesis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-800 tracking-tight leading-snug">
              {headline}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            {executiveSummary}
          </p>

          {/* Severity Badges Breakdown */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Breakdown:
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                Critical: {severityBreakdown["Critical"] || 0}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100">
                High: {severityBreakdown["High"] || 0}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                Medium: {severityBreakdown["Medium"] || 0}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Low: {severityBreakdown["Low"] || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
