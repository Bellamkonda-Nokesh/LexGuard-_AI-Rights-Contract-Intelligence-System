import React, { useState, useEffect } from "react";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LandingHero } from "./components/LandingHero";
import { StatCardsRow } from "./components/StatCardsRow";
import { UploadCard } from "./components/UploadCard";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { DocumentHistoryView } from "./components/DocumentHistoryView";
import { BenchmarkLibraryView } from "./components/BenchmarkLibraryModal";
import { AuthModal } from "./components/AuthModal";
import type { DocumentRiskReport, AuthUser } from "./types";
import { analyzeContract, fetchDocumentReport } from "./services/api";
import { auth, logoutUser } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function App() {
  const [currentTab, setCurrentTab] = useState<"analyze" | "history" | "benchmarks">("analyze");
  const [currentReport, setCurrentReport] = useState<DocumentRiskReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agentProgressStage, setAgentProgressStage] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Monitor Firebase Auth session state
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const handleAnalyze = async (file: File) => {
    setIsLoading(true);
    setAgentProgressStage("Ingestion Agent extracting raw text and verifying layout...");

    // Staged updates to reflect real-time multi-agent pipeline
    const timer1 = setTimeout(() => {
      setAgentProgressStage("Clause Extraction Agent classifying clauses into taxonomy...");
    }, 1500);

    const timer2 = setTimeout(() => {
      setAgentProgressStage("Risk Reasoning Agent running RAG vector comparison and implication analysis...");
    }, 3000);

    const timer3 = setTimeout(() => {
      setAgentProgressStage("Aggregation Agent synthesizing executive report via Gemini 2.5 Pro...");
    }, 4500);

    try {
      const report = await analyzeContract(file, user?.uid || "demo_user");
      setCurrentReport(report);
      setCurrentTab("analyze");
    } catch (err: any) {
      alert(`Contract analysis error: ${err.message || err}`);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsLoading(false);
      setAgentProgressStage("");
    }
  };

  const handleSelectHistoryDocument = async (documentId: string) => {
    setIsLoading(true);
    try {
      const report = await fetchDocumentReport(documentId, user?.uid || "demo_user");
      setCurrentReport(report);
      setCurrentTab("analyze");
    } catch (err: any) {
      alert(`Could not load document: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-navy-800 antialiased font-sans">
      {/* 1. Persistent Legal Disclaimer Banner */}
      <DisclaimerBanner />

      <div className="flex-1 flex w-full">
        {/* 2. Left Navigation Sidebar matching Reference Images 3 & 4 */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onNewUpload={() => {
            setCurrentReport(null);
            setCurrentTab("analyze");
          }}
          hasReport={!!currentReport}
        />

        {/* 3. Main Application Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            user={user}
            onLogin={() => setAuthModalOpen(true)}
            onLogout={handleLogout}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto">
            {currentTab === "analyze" && (
              <>
                {currentReport ? (
                  <ResultsDashboard
                    report={currentReport}
                    onReset={() => setCurrentReport(null)}
                  />
                ) : (
                  <div className="space-y-6 max-w-5xl mx-auto">
                    <LandingHero onGetStarted={() => {}} />
                    <StatCardsRow report={null} />
                    <UploadCard
                      onAnalyze={handleAnalyze}
                      isLoading={isLoading}
                      agentProgressStage={agentProgressStage}
                    />
                  </div>
                )}
              </>
            )}

            {currentTab === "history" && (
              <DocumentHistoryView
                onSelectDocument={handleSelectHistoryDocument}
                userId={user?.uid || "demo_user"}
              />
            )}

            {currentTab === "benchmarks" && (
              <BenchmarkLibraryView />
            )}
          </main>

          {/* 4. Sleek Footer */}
          <footer className="border-t border-slate-100 bg-white py-5 px-6">
            <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <p>
                © {new Date().getFullYear()} LexGuard — AI Rights &amp; Contract Intelligence System. Built with Google Gemini 2.5, LangGraph &amp; Cloud Run.
              </p>
              <p className="text-center sm:text-right font-medium">
                Automated intelligence tool. Does not constitute formal legal advice.
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* 5. Firebase Auth Dialog */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />
    </div>
  );
}

export default App;