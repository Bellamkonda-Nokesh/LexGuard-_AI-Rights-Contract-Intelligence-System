import React from "react";
import { ShieldCheck, Info } from "lucide-react";

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside 
      aria-label="Legal Disclaimer" 
      role="note"
      className="bg-indigo-50/70 border-b border-indigo-100/80 text-indigo-950 px-4 py-2 text-xs font-medium"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" aria-hidden="true" />
          <span>
            <strong>IMPORTANT LEGAL DISCLAIMER:</strong> LexGuard is an AI intelligence tool for informational and preliminary review purposes only. It does <strong>NOT</strong> provide legally binding advice, attorney representation, or formal legal opinions. Always consult a licensed attorney before signing.
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-indigo-700 font-bold bg-white/80 border border-indigo-200/60 px-2.5 py-0.5 rounded-full shadow-sm shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Informational Use Only</span>
        </div>
      </div>
    </aside>
  );
};
