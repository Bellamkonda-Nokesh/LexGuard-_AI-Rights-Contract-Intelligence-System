import React from "react";
import { Shield, History, BookOpen, Cpu, LogIn, LogOut, User as UserIcon } from "lucide-react";
import type { AuthUser } from "../types";

interface NavbarProps {
  currentTab: "analyze" | "history" | "benchmarks";
  setCurrentTab: (tab: "analyze" | "history" | "benchmarks") => void;
  user: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setCurrentTab("analyze")} 
          className="flex items-center gap-2.5 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setCurrentTab("analyze")}
          aria-label="LexGuard Home"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                LexGuard
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                AI Rights
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Contract Intelligence System
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
          <button
            onClick={() => setCurrentTab("analyze")}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              currentTab === "analyze"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            aria-current={currentTab === "analyze" ? "page" : undefined}
          >
            <Cpu className="w-4 h-4" aria-hidden="true" />
            <span>Analyze</span>
          </button>

          <button
            onClick={() => setCurrentTab("history")}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              currentTab === "history"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            aria-current={currentTab === "history" ? "page" : undefined}
          >
            <History className="w-4 h-4" aria-hidden="true" />
            <span>History</span>
          </button>

          <button
            onClick={() => setCurrentTab("benchmarks")}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              currentTab === "benchmarks"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            aria-current={currentTab === "benchmarks" ? "page" : undefined}
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Fair Benchmarks</span>
            <span className="sm:hidden">Benchmarks</span>
          </button>
        </nav>

        {/* Auth / Session State */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 py-1.5 px-3 rounded-full border border-slate-200 dark:border-slate-700">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {user.displayName ? user.displayName[0].toUpperCase() : "U"}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden sm:inline max-w-[120px] truncate">
                {user.displayName || user.email || "Signed In"}
              </span>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg shadow-sm transition"
              aria-label="Sign in with Firebase"
            >
              <LogIn className="w-4 h-4 text-blue-600" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
