import React, { useState } from "react";
import type { AgentTrace } from "../types";
import { Cpu, CheckCircle2, Clock, ChevronDown, ChevronUp, Terminal } from "lucide-react";

interface ExplainabilityPanelProps {
  traces: AgentTrace[];
  processingTimeSeconds?: number;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  traces,
  processingTimeSeconds,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div 
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="explainability-trace-content"
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Explainable AI & Agent Reasoning Trace
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                LangGraph 4-Agent Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Inspect step-by-step agent decisions, Chroma benchmark lookups, and Gemini synthesis timings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {processingTimeSeconds && (
            <span className="text-xs font-semibold text-slate-500 hidden sm:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{processingTimeSeconds}s total</span>
            </span>
          )}
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Toggle Explainability Panel"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="explainability-trace-content" className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {traces.map((trace, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      Node {idx + 1}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{trace.duration_ms}ms</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {trace.agent_name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {trace.step}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                    {trace.reasoning_summary}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Full Audit Log View */}
          <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2 overflow-x-auto">
            <div className="flex items-center gap-2 text-slate-400 font-semibold border-b border-slate-800 pb-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Firestore Trace Audit Log (Document Scoped)</span>
            </div>
            {traces.map((t, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-emerald-400">[{t.timestamp?.slice(11, 19) || "00:00:00"}]</span>{" "}
                <span className="text-purple-400 font-bold">{t.agent_name}:</span>{" "}
                <span className="text-slate-300">{t.reasoning_summary}</span>{" "}
                <span className="text-slate-500">({t.duration_ms}ms)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
