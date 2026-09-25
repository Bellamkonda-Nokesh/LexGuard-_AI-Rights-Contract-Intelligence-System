import React from "react";
import { Shield, Sparkles, Scale, Cpu, CheckCircle2, Lock, ArrowDown } from "lucide-react";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onGetStarted }) => {
  return (
    <div className="py-8 sm:py-12 text-center max-w-4xl mx-auto space-y-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Autonomous Multi-Agent AI Legal Intelligence</span>
      </div>

      {/* Main Headline */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Deconstruct Complex Contracts. <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Expose Hidden Liabilities.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          LexGuard utilizes a 4-agent LangGraph orchestration powered by Google Gemini 2.5 and Chroma vector RAG to analyze agreements, translate legalese into plain English, and generate negotiation redlines in seconds.
        </p>
      </div>

      {/* Key Features Pill Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
            <Cpu className="w-4 h-4" />
            <span>4-Agent LangGraph</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Ingestion → Extraction → Risk Reasoning → Aggregation.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
            <Scale className="w-4 h-4" />
            <span>Chroma RAG Benchmarks</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Measures every clause against balanced fair industry standards.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Plain English</span>
          </div>
          <p className="text-[11px] text-slate-500">
            No legal jargon: what the terms actually mean for your rights.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs">
            <Lock className="w-4 h-4" />
            <span>Google Cloud Run</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Enterprise containerized security with scoped Firestore rules.
          </p>
        </div>
      </div>
    </div>
  );
};
