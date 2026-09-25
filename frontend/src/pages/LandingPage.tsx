import React from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Scale, 
  Cpu, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight,
  UploadCloud,
  FileCheck,
  Zap,
  Globe
} from "lucide-react";

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onGoToLogin: () => void;
  onSelectSample?: (sampleType: "employment" | "saas") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onGoToLogin,
  onSelectSample,
}) => {
  return (
    <div className="min-h-screen bg-canvas text-navy-800 antialiased font-sans flex flex-col selection:bg-brand-500 selection:text-white">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-card-glow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-navy-800 tracking-tight">LexGuard</span>
                <span className="w-2 h-2 rounded-full bg-brand-600" />
              </div>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                AI Rights & Contract Intelligence
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition">How It Works</a>
            <a href="#benchmarks" className="hover:text-brand-600 transition">Fair Benchmarks</a>
            <a href="#taxonomy" className="hover:text-brand-600 transition">7+ Taxonomies</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 text-xs font-bold text-navy-800 hover:text-brand-600 transition"
            >
              Sign In
            </button>
            <button
              onClick={onLaunchDashboard}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold shadow-soft transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-200/40 via-indigo-100/30 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Tech Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100 text-brand-700 text-xs font-bold shadow-soft-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin-slow" />
            <span>Autonomous Multi-Agent Legal Intelligence • Powered by Google Gemini 2.5</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-navy-800 tracking-tight max-w-5xl mx-auto leading-[1.1]">
            Contract Intelligence <br />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Before You Sign.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
            Instantly detect hidden liabilities, non-competes, and one-sided clauses. 
            Compare agreements against standard fair benchmarks and receive copyable counter-proposals in plain English.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onLaunchDashboard}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-sm shadow-soft flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
            >
              <span>Analyze Your Contract Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (onSelectSample) onSelectSample("employment");
                onLaunchDashboard();
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-navy-800 font-bold text-sm shadow-soft flex items-center justify-center gap-2 transition"
            >
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Try Sample Employment Agreement</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>PDF, DOCX & Scanned OCR</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Chroma Vector RAG Benchmarks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Instant Plain-English Explanations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero Document Training Retention</span>
            </div>
          </div>

          {/* Interactive UI Mockup Card Preview */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="p-3 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card-glow relative overflow-hidden text-left">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-bold text-slate-400 ml-2">LexGuard Dashboard Preview • Executive Employment Contract</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  Overall Risk: 83/100 (High)
                </span>
              </div>

              {/* Sample Mini Preview Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {/* Metric Card 1 */}
                <div className="p-4 rounded-2xl bg-navy-800 text-white space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Severity Index</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">Critical</span>
                  </div>
                  <div className="text-2xl font-extrabold">83 <span className="text-xs text-slate-400">/ 100</span></div>
                  <p className="text-[11px] text-slate-400">2 high-liability restrictive covenants detected.</p>
                </div>

                {/* Metric Card 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Benchmark Match</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">Chroma RAG</span>
                  </div>
                  <div className="text-2xl font-extrabold text-navy-800">42% <span className="text-xs text-slate-400">Fairness</span></div>
                  <p className="text-[11px] text-slate-400">Diverges from 6-month geographic standard.</p>
                </div>

                {/* Metric Card 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Pipeline Latency</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-brand-700 text-[10px] font-bold">Gemini 2.5</span>
                  </div>
                  <div className="text-2xl font-extrabold text-navy-800">3.4s <span className="text-xs text-slate-400">Rollup</span></div>
                  <p className="text-[11px] text-slate-400">4 agents completed full statutory audit.</p>
                </div>
              </div>

              {/* Sample Flagged Clause Snippet */}
              <div className="mt-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase">Critical Liability</span>
                    <h4 className="text-xs font-bold text-navy-800">Worldwide Non-Compete (2-Year Duration)</h4>
                  </div>
                  <span className="text-[11px] font-bold text-brand-600 cursor-pointer" onClick={onLaunchDashboard}>View Full Redline →</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1 italic">
                  "Employee agrees not to engage directly or indirectly in any competitive business worldwide for 24 months..."
                </p>
                <div className="p-3 rounded-xl bg-white border border-rose-200/80 text-xs space-y-1">
                  <div className="font-bold text-brand-700 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3 h-3 text-brand-600" />
                    Plain English Translation:
                  </div>
                  <p className="text-slate-600 text-xs">
                    You are barred from working in your entire industry anywhere on Earth for two years without guaranteed severance or garden leave pay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
              Full Spectrum Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-800 tracking-tight">
              Why Legal Teams & Professionals Trust LexGuard
            </h2>
            <p className="text-sm text-slate-500">
              Unlike generic LLM wrappers, LexGuard orchestrates a specialized LangGraph multi-agent architecture with persistent vector embeddings and fair clause benchmarking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-soft transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-600 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-800">LangGraph 4-Agent Pipeline</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ingestion, Clause Extraction, Risk Reasoning, and Pro Synthesis agents coordinate in a stateful graph to ensure verified reasoning.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-soft transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-800">Chroma Vector Benchmarks</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pre-seeded with balanced, fair-market clauses to evaluate your contract against balanced legal standards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-soft transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-800">Hazard & Ambiguity Detection</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Flags hidden indemnities, uncapped damages, perpetual IP assignments, and contradictory clauses automatically.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-soft transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-800">Actionable Redline Proposals</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generates copyable counter-proposals ready to email to your counterparty, with specific statutory safeguards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
              3 Simple Steps
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-800 tracking-tight">
              From Upload to Negotiating Power in Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-soft relative space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-sm shadow-soft">
                1
              </div>
              <h3 className="text-lg font-bold text-navy-800">Upload Agreement</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drag-and-drop any PDF, Word document (.docx), or scanned image. Ingestion Agent normalizes layout and triggers Gemini OCR if needed.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-soft relative space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-sm shadow-soft">
                2
              </div>
              <h3 className="text-lg font-bold text-navy-800">Multi-Agent RAG Audit</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Extraction Agent extracts operative clauses across 7 categories. Risk Reasoning Agent queries Chroma vector benchmarks for fairness divergence.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-soft relative space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-sm shadow-soft">
                3
              </div>
              <h3 className="text-lg font-bold text-navy-800">Negotiate with Confidence</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review concentric risk scores, plain-English impact summaries, and 1-click copyable redline counter-proposals to send to counsel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 7+ Legal Taxonomies Section */}
      <section id="taxonomy" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-navy-800 tracking-tight">
              Pre-Trained Across 7+ Contract Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Specialized classification logic tailors severity criteria to the specific legal relationship.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {[
              { label: "Employment", desc: "Non-compete, IP assignment" },
              { label: "Vendor & Supply", desc: "SLAs, payment terms" },
              { label: "SaaS & Software", desc: "Data lock-in, uptime" },
              { label: "Rental & Lease", desc: "Security deposit, repairs" },
              { label: "Insurance", desc: "Exclusions, claims" },
              { label: "Terms of Service", desc: "Mandatory arbitration" },
              { label: "Privacy Policy", desc: "Third-party tracking" },
            ].map((cat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1 hover:bg-brand-50/50 hover:border-brand-200 transition">
                <span className="text-xs font-bold text-navy-800 block">{cat.label}</span>
                <span className="text-[10px] text-slate-400 block">{cat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call To Action Footer Banner */}
      <section className="py-16 bg-navy-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/50 to-indigo-900/50 -z-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Never Sign an Unfair Contract Again.
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join developers, freelancers, and enterprise procurement teams protecting their rights with LexGuard.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-2xl bg-white text-navy-800 hover:bg-slate-100 font-bold text-sm shadow-soft transition-all hover:scale-105 active:scale-95"
            >
              Get Started Free — Open Dashboard
            </button>
            <button
              onClick={onGoToLogin}
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer with Informational Legal Disclaimer */}
      <footer className="border-t border-slate-100 bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span className="font-bold text-navy-800">LexGuard AI</span>
            <span>• © {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <p className="text-center sm:text-right max-w-xl text-[11px] leading-relaxed text-slate-400">
            <strong>LEGAL NOTICE:</strong> LexGuard is an automated AI intelligence tool built for informational and preliminary review purposes only. It does not provide legally binding advice, attorney representation, or formal legal opinions. Always consult a licensed attorney before executing binding contracts.
          </p>
        </div>
      </footer>
    </div>
  );
};