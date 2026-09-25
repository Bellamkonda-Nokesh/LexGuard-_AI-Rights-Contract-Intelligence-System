export type SeverityLevel = "Low" | "Medium" | "High" | "Critical";

export type ClauseCategory = 
  | "employment" 
  | "vendor" 
  | "subscription" 
  | "rental" 
  | "insurance" 
  | "tos" 
  | "privacy_policy" 
  | "other";

export interface BenchmarkClause {
  id: string;
  category: string;
  clause_type: string;
  title: string;
  standard_clause_text: string;
  fairness_rationale: string;
  key_safeguards: string[];
  typical_red_flags: string[];
  similarity_score?: number;
}

export interface ClauseAnalysis {
  clause_id: string;
  category: ClauseCategory;
  title: string;
  original_text: string;
  page_number?: number;
  severity: SeverityLevel;
  risk_score: number;
  plain_explanation: string;
  risk_rationale: string;
  hidden_liabilities: string[];
  ambiguities_or_contradictions: string[];
  benchmark_comparison?: BenchmarkClause | null;
  negotiation_recommendation?: string | null;
  confidence_score: number;
}

export interface AgentTrace {
  agent_name: string;
  step: string;
  timestamp: string;
  duration_ms: number;
  status: string;
  reasoning_summary: string;
  output_summary?: string | null;
  details?: Record<string, any>;
}

export interface DocumentRiskReport {
  document_id: string;
  filename: string;
  file_type: string;
  uploaded_at: string;
  overall_risk_score: number;
  overall_risk_level: SeverityLevel;
  summary_headline: string;
  executive_summary: string;
  total_clauses_extracted: number;
  flagged_clauses_count: number;
  severity_breakdown: Record<string, number>;
  category_breakdown: Record<string, number>;
  clauses: ClauseAnalysis[];
  agent_traces: AgentTrace[];
  disclaimer: string;
  processing_time_seconds: number;
}

export interface DocumentHistoryItem {
  document_id: string;
  filename: string;
  uploaded_at: string;
  overall_risk_score: number;
  overall_risk_level: SeverityLevel;
  flagged_clauses_count: number;
  total_clauses: number;
  summary_headline: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
}
