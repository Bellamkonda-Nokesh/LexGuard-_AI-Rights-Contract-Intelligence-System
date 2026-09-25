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
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-soft">
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
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-navy-800">
                Explainable AI & Agent Reasoning Trace
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
                LangGraph 4-Agent Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Inspect step-by-step cognitive decisions, Chroma RAG matches, and Gemini synthesis timings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {processingTimeSeconds && (
            <span className="text-xs font-bold text-slate-400 hidden sm:flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              <span>{processingTimeSeconds}s total</span>
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-100">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div id="explainability-trace-content" className="mt-6 pt-6 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {traces.map((trace, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider bg-brand-100/60 px-2 py-0.5 rounded-md">
                      Node {idx + 1}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{trace.duration_ms}ms</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-navy-800">
                    {trace.agent_name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {trace.step}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                    {trace.reasoning_summary}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Full Audit Log View */}
          <div className="p-4 rounded-2xl bg-navy-800 text-slate-200 font-mono text-xs space-y-2 overflow-x-auto shadow-inner">
            <div className="flex items-center gap-2 text-slate-400 font-semibold border-b border-slate-700 pb-2">
              <Terminal className="w-4 h-4 text-brand-400" />
              <span>Firestore Trace Audit Log (User Scoped)</span>
            </div>
            {traces.map((t, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-emerald-400">[{t.timestamp?.slice(11, 19) || "00:00:00"}]</span>{" "}
                <span className="text-brand-300 font-bold">{t.agent_name}:</span>{" "}
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
