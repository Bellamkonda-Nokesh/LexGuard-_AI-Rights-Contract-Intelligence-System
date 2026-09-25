import React from "react";
import { Cpu, Scale, Sparkles, Lock, ArrowRight } from "lucide-react";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = () => {
  return (
    <div className="space-y-4">
      {/* 3 Floating Highlight Feature Cards matching Reference Image 3 ("Transfer Cards") */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft flex items-center gap-4 group hover:shadow-soft-lg transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-600 shrink-0 group-hover:scale-105 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Multi-Agent Engine
            </span>
            <h4 className="text-sm font-extrabold text-navy-800">
              LangGraph 4-Agent
            </h4>
            <p className="text-[11px] text-slate-400">
              Ingestion to Pro Synthesis
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft flex items-center gap-4 group hover:shadow-soft-lg transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              RAG Vector Database
            </span>
            <h4 className="text-sm font-extrabold text-navy-800">
              Chroma Benchmarks
            </h4>
            <p className="text-[11px] text-slate-400">
              Balanced standard clauses
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft flex items-center gap-4 group hover:shadow-soft-lg transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Rights Protection
            </span>
            <h4 className="text-sm font-extrabold text-navy-800">
              Plain English & Redlines
            </h4>
            <p className="text-[11px] text-slate-400">
              Negotiation counter-proposals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
