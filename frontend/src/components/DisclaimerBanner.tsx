import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside 
      aria-label="Legal Disclaimer" 
      role="note"
      className="bg-amber-500/10 border-b border-amber-500/30 text-amber-950 dark:text-amber-200 px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
          <span>
            <strong>IMPORTANT LEGAL DISCLAIMER:</strong> LexGuard is an AI intelligence tool for informational and preliminary review purposes only. It does <strong>NOT</strong> provide legally binding advice, attorney representation, or formal legal opinions. Always consult a licensed attorney before signing.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-semibold bg-amber-500/10 px-2 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Informational Use Only</span>
        </div>
      </div>
    </aside>
  );
};
