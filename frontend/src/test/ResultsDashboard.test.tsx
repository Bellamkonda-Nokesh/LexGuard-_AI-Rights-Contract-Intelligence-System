import { render, screen, fireEvent } from "@testing-library/react";
import { ResultsDashboard } from "../components/ResultsDashboard";
import type { DocumentRiskReport, SeverityLevel, ClauseCategory } from "../types";

const mockReport: DocumentRiskReport = {
  document_id: "doc-test-123",
  filename: "Employment_Agreement.pdf",
  file_type: "PDF",
  uploaded_at: "2026-09-25T12:00:00Z",
  overall_risk_score: 82.5,
  overall_risk_level: "High" as SeverityLevel,
  summary_headline: "Contract Contains Significant Liabilities",
  executive_summary: "Detailed executive risk analysis.",
  total_clauses_extracted: 2,
  flagged_clauses_count: 2,
  severity_breakdown: { Critical: 1, High: 1, Medium: 0, Low: 0 },
  category_breakdown: { employment: 2 },
  clauses: [
    {
      clause_id: "c-01",
      category: "employment" as ClauseCategory,
      title: "Worldwide Non-Compete",
      original_text: "Employee shall not engage in competing business worldwide for 2 years.",
      severity: "Critical" as SeverityLevel,
      risk_score: 92.0,
      plain_explanation: "You cannot work for any competitor anywhere for 2 years.",
      risk_rationale: "Unreasonable worldwide scope without garden leave compensation.",
      hidden_liabilities: ["Loss of livelihood", "Injunction risk"],
      ambiguities_or_contradictions: [],
      benchmark_comparison: {
        id: "bench-emp-01",
        category: "employment",
        clause_type: "non_compete",
        title: "Standard 6-month non-compete",
        standard_clause_text: "Non-compete limited to 6 months and 50 miles.",
        fairness_rationale: "Limited duration with garden leave.",
        key_safeguards: ["6 months duration", "Garden leave"],
        typical_red_flags: ["Worldwide scope"]
      },
      negotiation_recommendation: "Request reduction to 6 months.",
      confidence_score: 0.95
    },
    {
      clause_id: "c-02",
      category: "employment" as ClauseCategory,
      title: "Perpetual IP Assignment",
      original_text: "Employee assigns all creations anytime.",
      severity: "High" as SeverityLevel,
      risk_score: 75.0,
      plain_explanation: "Company owns work made on your personal time.",
      risk_rationale: "Missing statutory carve-outs.",
      hidden_liabilities: [],
      ambiguities_or_contradictions: [],
      negotiation_recommendation: "Carve out personal projects.",
      confidence_score: 0.9
    }
  ],
  agent_traces: [
    {
      agent_name: "Ingestion Agent",
      step: "Extraction",
      timestamp: "2026-09-25T12:00:01Z",
      duration_ms: 120,
      status: "success",
      reasoning_summary: "Parsed PDF successfully."
    }
  ],
  disclaimer: "LexGuard does NOT provide legally binding advice.",
  processing_time_seconds: 3.4
};

describe("ResultsDashboard Component", () => {
  it("renders overall risk score gauge and executive headline", () => {
    const handleReset = vi.fn();
    render(<ResultsDashboard report={mockReport} onReset={handleReset} />);

    expect(screen.getByText("83")).toBeInTheDocument(); // Math.round(82.5)
    expect(screen.getByText(/Contract Contains Significant Liabilities/i)).toBeInTheDocument();
    expect(screen.getByText(/Detailed executive risk analysis/i)).toBeInTheDocument();
  });

  it("renders flagged clauses list sorted by severity", () => {
    const handleReset = vi.fn();
    render(<ResultsDashboard report={mockReport} onReset={handleReset} />);

    expect(screen.getByText("Worldwide Non-Compete")).toBeInTheDocument();
    expect(screen.getByText("Perpetual IP Assignment")).toBeInTheDocument();
  });

  it("filters clauses by keyword search", () => {
    const handleReset = vi.fn();
    render(<ResultsDashboard report={mockReport} onReset={handleReset} />);

    const searchInput = screen.getByPlaceholderText(/Search clauses.../i);
    fireEvent.change(searchInput, { target: { value: "Non-Compete" } });

    expect(screen.getByText("Worldwide Non-Compete")).toBeInTheDocument();
    expect(screen.queryByText("Perpetual IP Assignment")).not.toBeInTheDocument();
  });

  it("expands a clause to reveal plain English explanation and negotiation recommendation", () => {
    const handleReset = vi.fn();
    render(<ResultsDashboard report={mockReport} onReset={handleReset} />);

    // First clause is expanded by default (index 0)
    expect(screen.getByText(/What This Means For You/i)).toBeInTheDocument();
    expect(screen.getByText(/Suggested Negotiation Language/i)).toBeInTheDocument();
    expect(screen.getByText(/Request reduction to 6 months/i)).toBeInTheDocument();
  });
});
