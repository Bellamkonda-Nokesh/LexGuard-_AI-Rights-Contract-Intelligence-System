import React from "react";
import type { SeverityLevel } from "../types";
import { formatSeverityColor } from "../lib/utils";
import { AlertCircle, CheckCircle, ShieldAlert, AlertTriangle } from "lucide-react";

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
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getSeverityIcon = () => {
    switch (level) {
      case "Critical":
        return <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />;
      case "High":
        return <ShieldAlert className="w-5 h-5 text-orange-600" aria-hidden="true" />;
      case "Medium":
        return <AlertTriangle className="w-5 h-5 text-amber-600" aria-hidden="true" />;
      case "Low":
      default:
        return <CheckCircle className="w-5 h-5 text-emerald-600" aria-hidden="true" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Animated Score Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
          <div 
            className="relative flex items-center justify-center"
            role="meter"
            aria-label="Overall Document Risk Score"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${score} out of 100, ${level} Risk`}
          >
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="10"
                fill="none"
              />
              {/* Progress stroke */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="currentColor"
                className={`transition-all duration-1000 ease-out ${
                  level === "Critical"
                    ? "text-red-600"
                    : level === "High"
                    ? "text-orange-500"
                    : level === "Medium"
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Centered Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {Math.round(score)}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Risk Score / 100
              </span>
            </div>
          </div>

          {/* Severity Badge */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sevColor.badge}`}
            >
              {getSeverityIcon()}
              <span>{level.toUpperCase()} RISK</span>
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-500">
            {flaggedClauses} of {totalClauses} clauses flagged
          </div>
        </div>

        {/* Right: Executive Summary & Severity Breakdown */}
        <div className="lg:col-span-8 space-y-4">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              Executive Legal Assessment
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {headline}
            </h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {executiveSummary}
          </p>

          {/* Severity Badges Breakdown */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Clauses by Severity:
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                Critical: {severityBreakdown["Critical"] || 0}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                High: {severityBreakdown["High"] || 0}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Medium: {severityBreakdown["Medium"] || 0}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Low: {severityBreakdown["Low"] || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
