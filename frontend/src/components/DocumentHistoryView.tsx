import React, { useState, useEffect } from "react";
import type { DocumentHistoryItem } from "../types";
import { fetchDocumentHistory } from "../services/api";
import { formatSeverityColor } from "../lib/utils";
import { History, FileText, ArrowRight, Calendar } from "lucide-react";

interface DocumentHistoryViewProps {
  onSelectDocument: (docId: string) => void;
  userId?: string;
}

export const DocumentHistoryView: React.FC<DocumentHistoryViewProps> = ({
  onSelectDocument,
  userId,
}) => {
  const [historyItems, setHistoryItems] = useState<DocumentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const items = await fetchDocumentHistory(userId);
        setHistoryItems(items);
      } catch (err) {
        console.error("Failed to load document history", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Past Contract Analyses
          </h2>
          <p className="text-sm text-slate-500">
            Previously analyzed documents stored securely in Google Cloud Firestore.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">
          Loading document history from Firestore...
        </div>
      ) : historyItems.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Documents Analyzed Yet
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Upload your first contract on the Analyze tab to generate a risk report.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {historyItems.map((item) => {
            const sevColor = formatSeverityColor(item.overall_risk_level);
            return (
              <div
                key={item.document_id}
                onClick={() => onSelectDocument(item.document_id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectDocument(item.document_id)}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${sevColor.badge}`}>
                      {item.overall_risk_level} ({Math.round(item.overall_risk_score)}/100)
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.uploaded_at?.slice(0, 10) || "Recent"}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {item.filename}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {item.summary_headline || `${item.flagged_clauses_count} flagged clauses identified`}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-semibold text-slate-500">
                    {item.flagged_clauses_count} flagged
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
