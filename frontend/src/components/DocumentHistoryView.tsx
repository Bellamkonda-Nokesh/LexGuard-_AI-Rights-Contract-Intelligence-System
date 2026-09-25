import React, { useState, useEffect } from "react";
import type { DocumentHistoryItem } from "../types";
import { fetchDocumentHistory } from "../services/api";
import { formatSeverityColor } from "../utils";
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
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-800 tracking-tight">
            Past Contract Analyses
          </h2>
          <p className="text-xs text-slate-400">
            Previously analyzed documents stored securely in Google Cloud Firestore.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-semibold">
          Loading document history from Firestore...
        </div>
      ) : historyItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-navy-800">
            No Documents Analyzed Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload your first contract on the Dashboard tab to generate an intelligence risk report.
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
                className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft hover:border-brand-200 hover:shadow-soft-lg transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                    DOC
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${sevColor.badge}`}>
                        {item.overall_risk_level} ({Math.round(item.overall_risk_score)}/100)
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        {item.uploaded_at?.slice(0, 10) || "Recent"}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-navy-800 group-hover:text-brand-600 transition-colors">
                      {item.filename}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {item.summary_headline || `${item.flagged_clauses_count} flagged clauses identified`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                    {item.flagged_clauses_count} flagged
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-xs">
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
