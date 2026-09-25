import React from "react";
import { Search, Bell, LogIn, LogOut } from "lucide-react";
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
    <header className="bg-white border-b border-slate-100 px-6 py-3.5 sticky top-[37px] z-30">
      <div className="flex items-center justify-between gap-4">
        {/* Left Greeting matching Reference Image 3 ("Hi Nanas, Welcome to Peymen") */}
        <div>
          <h1 className="text-xl font-extrabold text-navy-800 tracking-tight">
            {currentTab === "analyze" ? "Contract Intelligence Dashboard" : currentTab === "history" ? "Contract History" : "Standard Fair Benchmarks"}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Autonomous multi-agent legal reasoning powered by Google Gemini 2.5
          </p>
        </div>

        {/* Right Controls: Search, Notification, Profile Chip */}
        <div className="flex items-center gap-3">
          {/* Rounded-full Search bar matching reference images */}
          <div className="relative hidden sm:block w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contracts, clauses..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs text-navy-800 placeholder:text-slate-400 focus:bg-white focus:border-brand-300 transition-all"
            />
          </div>

          {/* Notification Bell */}
          <button 
            type="button" 
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-500 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-brand-600 absolute top-2 right-2 ring-2 ring-white" />
          </button>

          {/* User Profile Chip matching reference images (avatar + name + chevron) */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {user.displayName ? user.displayName[0].toUpperCase() : "A"}
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-navy-800 block leading-tight">
                  {user.displayName || "Advocate"}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-full transition-all shadow-sm"
              aria-label="Sign in"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto">
        <button
          onClick={() => setCurrentTab("analyze")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            currentTab === "analyze"
              ? "bg-brand-600 text-white shadow-soft-sm"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Analyze
        </button>
        <button
          onClick={() => setCurrentTab("history")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            currentTab === "history"
              ? "bg-brand-600 text-white shadow-soft-sm"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          History
        </button>
        <button
          onClick={() => setCurrentTab("benchmarks")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            currentTab === "benchmarks"
              ? "bg-brand-600 text-white shadow-soft-sm"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Fair Benchmarks
        </button>
      </div>
    </header>
  );
};