import React, { useState, useEffect } from "react";
import type { BenchmarkClause } from "../types";
import { fetchBenchmarks } from "../services/api";
import { BookOpen, Scale, CheckCircle2, AlertTriangle, Filter } from "lucide-react";

export const BenchmarkLibraryView: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkClause[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const catParam = selectedCategory === "all" ? undefined : selectedCategory;
        const data = await fetchBenchmarks(catParam);
        setBenchmarks(data);
      } catch (err) {
        console.error("Failed to load benchmarks", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory]);

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "employment", label: "Employment" },
    { id: "subscription", label: "Subscription" },
    { id: "tos", label: "Terms of Service" },
    { id: "privacy_policy", label: "Privacy Policy" },
    { id: "vendor", label: "Vendor / MSA" },
    { id: "rental", label: "Rental / Lease" },
    { id: "insurance", label: "Insurance" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Chroma Vector Store RAG Library</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Standard & Fair Legal Clause Benchmarks
          </h2>
          <p className="text-sm text-slate-500">
            Gold-standard balanced clauses used by the Risk Reasoning Agent to measure contract fairness.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">
          Loading benchmark clauses...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benchmarks.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {b.category.replace("_", " ")}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {b.clause_type}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{b.title}</span>
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed border border-slate-200 dark:border-slate-800">
                  "{b.standard_clause_text}"
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Fairness Rationale:</strong> {b.fairness_rationale}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                {b.key_safeguards?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Key Safeguards:
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside space-y-0.5">
                      {b.key_safeguards.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {b.typical_red_flags?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Typical Aggressive Red Flags:
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside space-y-0.5">
                      {b.typical_red_flags.map((rf, idx) => (
                        <li key={idx}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
