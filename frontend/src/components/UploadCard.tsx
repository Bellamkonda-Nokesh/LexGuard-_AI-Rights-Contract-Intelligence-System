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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !isLoading && fileInputRef.current?.click()}
        aria-label="Upload legal document for analysis. Click or drag and drop PDF, DOCX, or scanned images."
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-850"
        } shadow-sm`}
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
          <div className="py-6 flex flex-col items-center justify-center space-y-4" role="status" aria-live="polite">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 animate-spin" />
              <Sparkles className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                LangGraph Multi-Agent Pipeline Running...
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                {agentProgressStage || "Deconstructing clauses and comparing against fair benchmarks..."}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Ingestion</span>
              <span>→</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Clause Extraction</span>
              <span>→</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Risk Reasoning</span>
              <span>→</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Gemini Pro Rollup</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Upload Legal Contract or Agreement
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Drag & drop your document here, or click to browse. Supports PDF, Word (DOCX), and scanned images (PNG/JPG via Gemini OCR).
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">PDF</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">DOCX</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">Scanned OCR</span>
              <span>Max 15MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Announcement */}
      {errorMessage && (
        <div 
          role="alert" 
          className="flex items-center gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm font-medium"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1-Click Evaluation Benchmark Contracts */}
      <div className="bg-slate-100/70 dark:bg-slate-850/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Test: High-Risk Sample Contracts
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">1-Click Evaluation</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_CONTRACTS.map((preset, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => loadPresetContract(preset)}
              className="text-left p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 capitalize">
                  {preset.category}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1">
                {preset.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
