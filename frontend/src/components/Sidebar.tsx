import React from "react";
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  Scale, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  Plus
} from "lucide-react";

interface SidebarProps {
  currentTab: "analyze" | "history" | "benchmarks";
  setCurrentTab: (tab: "analyze" | "history" | "benchmarks") => void;
  onNewUpload: () => void;
  hasReport: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onNewUpload,
  hasReport,
}) => {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col justify-between p-5 min-h-[calc(100vh-37px)] sticky top-[37px] hidden md:flex">
      <div className="space-y-6">
        {/* Brand */}
        <div 
          onClick={() => { setCurrentTab("analyze"); }}
          className="flex items-center gap-3 cursor-pointer group px-2"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCurrentTab("analyze")}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-card-glow group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-navy-800 tracking-tight">
                LexGuard
              </span>
              <span className="w-2 h-2 rounded-full bg-brand-600" />
            </div>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              AI Rights System
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onNewUpload}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold shadow-soft flex items-center justify-center gap-2 group transition-all"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span>Analyze New Contract</span>
          </button>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
            Main Menu
          </span>

          <button
            onClick={() => setCurrentTab("analyze")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentTab === "analyze"
                ? "bg-brand-600 text-white shadow-soft font-bold"
                : "text-slate-500 hover:text-navy-800 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{hasReport ? "Results Dashboard" : "Upload & Analyze"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("history")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentTab === "history"
                ? "bg-brand-600 text-white shadow-soft font-bold"
                : "text-slate-500 hover:text-navy-800 hover:bg-slate-50"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Contract History</span>
          </button>

          <button
            onClick={() => setCurrentTab("benchmarks")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentTab === "benchmarks"
                ? "bg-brand-600 text-white shadow-soft font-bold"
                : "text-slate-500 hover:text-navy-800 hover:bg-slate-50"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Fair Benchmarks</span>
          </button>
        </div>

        {/* Multi-Agent System Section */}
        <div className="space-y-1 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
            System & Agents
          </span>

          <div className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-navy-800">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-brand-600" />
                LangGraph 4-Agent
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Ingestion • Extraction • Risk Reasoning • Pro Synthesis
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Promo Card matching Reference Image 3 ("Universal Card / Get a Premium Account") */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500 via-brand-600 to-indigo-700 text-white shadow-card-glow relative overflow-hidden space-y-3">
        {/* Subtle decorative circles */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10 blur-sm pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10 blur-sm pointer-events-none" />

        <div className="relative space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-300" />
            RAG Vector DB
          </span>
          <h4 className="text-sm font-bold leading-tight">
            Fair Benchmark Library
          </h4>
          <p className="text-[11px] text-indigo-100 leading-snug">
            8 pre-seeded balanced clauses for instant contract fairness evaluation.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab("benchmarks")}
          className="w-full py-2 rounded-xl bg-white text-brand-700 hover:bg-indigo-50 text-xs font-bold shadow-sm transition-colors text-center"
        >
          View Library
        </button>
      </div>
    </aside>
  );
};
