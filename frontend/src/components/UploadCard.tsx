import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

interface UploadCardProps {
  onAnalyze: (file: File) => Promise<void>;
  isLoading: boolean;
  agentProgressStage: string;
}

const PRESET_CONTRACTS = [
  {
    title: "Executive Employment Agreement",
    category: "employment",
    description: "2-yr worldwide non-compete, perpetual off-hours IP assignment, mandatory Delaware arbitration.",
    sampleText: `CONFIDENTIAL EMPLOYMENT AND PROPRIETARY INFORMATION AGREEMENT

Section 1. Non-Competition and Post-Employment Restrictions.
Employee covenants and agrees that during the term of employment and for a period of two (2) years following the termination of employment for any reason whatsoever, Employee shall not directly or indirectly engage in, perform services for, consult with, or invest in any competing business entity anywhere in the world.

Section 2. Comprehensive Intellectual Property Assignment.
Employee hereby irrevocably and perpetually assigns to Company all right, title, and interest throughout the universe in and to all inventions, discoveries, designs, works of authorship, and moral rights created or conceived at any time during the duration of employment, whether during business hours or on personal leisure time, and whether or not using Company equipment.

Section 3. Mandatory Binding Arbitration and Jury Waiver.
Any controversy, claim, or dispute arising out of or relating to this Agreement shall be settled exclusively by final and binding confidential arbitration administered in Wilmington, Delaware. Employee explicitly waives any constitutional right to a jury trial or class action consolidation.`
  },
  {
    title: "Enterprise SaaS Master Services Agreement",
    category: "subscription",
    description: "Silent auto-renewal, unilateral fee acceleration, customer indemnification with $50 vendor liability cap.",
    sampleText: `MASTER SERVICES SUBSCRIPTION AGREEMENT

Clause 1: Automatic Renewal and Cancellation Window.
This subscription shall automatically renew for successive twelve (12) month terms at Provider's then-current rates unless Customer delivers written notice of non-renewal via certified physical mail exactly ninety (90) calendar days prior to the expiration date.

Clause 2: Unilateral Indemnification and Limitation of Liability.
Customer shall defend, indemnify, and hold harmless Provider from and against any and all claims, damages, liabilities, and expenses arising out of the use of the Service. Under no circumstances shall Provider's total aggregate cumulative liability exceed $50.00.

Clause 3: Customer Telemetry and Monetization.
Provider retains the irrevocable, royalty-free, perpetual right to collect, monetize, and distribute customer behavioral telemetry and profile metadata to commercial third-party marketing affiliates.`
  },
  {
    title: "Commercial Lease Agreement",
    category: "rental",
    description: "Non-refundable deposit forfeiture, landlord 24/7 unannounced access, tenant structural repair obligations.",
    sampleText: `COMMERCIAL PROPERTY LEASE AGREEMENT

Section 4. Security Deposit Forfeiture and Administrative Fees.
The Security Deposit shall be non-refundable upon early termination for any reason and may be applied by Landlord to general building maintenance and turnover expenses without an itemized invoice.

Section 8. Landlord Right of Entry.
Landlord and its agents reserve the absolute right to enter the leased premises at any hour of the day or night without prior notice to inspect, alter, or show the premises.

Section 12. Uncapped Structural Maintenance and Casualty.
Tenant assumes full financial responsibility for all structural, roof, and foundation repairs during the lease term, regardless of cause or prior condition.`
  }
];

export const UploadCard: React.FC<UploadCardProps> = ({
  onAnalyze,
  isLoading,
  agentProgressStage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = [".pdf", ".docx", ".png", ".jpg", ".jpeg"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(ext)) {
      setErrorMessage(`Unsupported file format. Please upload PDF, DOCX, PNG, or JPG.`);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("File exceeds 15MB size limit. Please upload a smaller document.");
      return;
    }

    onAnalyze(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const loadPresetContract = (preset: typeof PRESET_CONTRACTS[0]) => {
    const blob = new Blob([preset.sampleText], { type: "text/plain" });
    const file = new File([blob], `${preset.title.replace(/\s+/g, "_")}.docx`, {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    validateAndProcessFile(file);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box matching pristine white card styling */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !isLoading && fileInputRef.current?.click()}
        aria-label="Upload legal document for analysis. Click or drag and drop PDF, DOCX, or scanned images."
        className={`relative rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer bg-white border-2 border-dashed ${
          isDragOver
            ? "border-brand-500 bg-brand-50/50 scale-[1.01]"
            : "border-slate-200 hover:border-brand-400 hover:bg-slate-50/50"
        } shadow-soft`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
          data-testid="file-upload-input"
          aria-hidden="true"
        />

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-4" role="status" aria-live="polite">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-brand-600 animate-spin" />
              <Sparkles className="w-6 h-6 text-brand-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-bold text-navy-800">
                LangGraph Multi-Agent Pipeline Running...
              </p>
              <p className="text-xs text-brand-600 font-semibold mt-1 max-w-md mx-auto">
                {agentProgressStage || "Deconstructing clauses and querying Chroma vector store..."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 pt-3">
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 1. Ingestion
              </span>
              <span>→</span>
              <span className="flex items-center gap-1 bg-indigo-50 text-brand-700 px-2.5 py-1 rounded-full font-bold">
                <CheckCircle2 className="w-3 h-3 text-brand-600" /> 2. Clause Extraction
              </span>
              <span>→</span>
              <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-bold">
                <CheckCircle2 className="w-3 h-3 text-purple-600" /> 3. Risk Reasoning
              </span>
              <span>→</span>
              <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold">
                4. Gemini Pro Rollup
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-brand-50 flex items-center justify-center text-brand-600 mb-2 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-800">
              Upload Legal Contract or Agreement
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Drag & drop your document here, or click to browse. Supports PDF, DOCX, and scanned images via native Gemini OCR.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">PDF</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">DOCX</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">Scanned OCR</span>
              <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold">Max 15MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Announcement */}
      {errorMessage && (
        <div 
          role="alert" 
          className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Test Cards matching Reference Image 3 & 4 layout */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-brand-600">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wider">
              Quick Test: High-Risk Sample Contracts
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
            1-Click Evaluation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_CONTRACTS.map((preset, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => loadPresetContract(preset)}
              className="text-left p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-brand-300 hover:bg-white hover:shadow-soft transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-100/60">
                  {preset.category}
                </span>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-xs">
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <h4 className="text-xs font-bold text-navy-800 line-clamp-1 mb-1">
                {preset.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
