import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UploadCard } from "../components/UploadCard";

describe("UploadCard Component", () => {
  it("renders upload zone and sample preset contract buttons", () => {
    const handleAnalyze = vi.fn();
    render(
      <UploadCard
        onAnalyze={handleAnalyze}
        isLoading={false}
        agentProgressStage=""
      />
    );

    expect(screen.getByText(/Upload Legal Contract or Agreement/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Employment Agreement/i)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise SaaS Master Services Agreement/i)).toBeInTheDocument();
  });

  it("handles clicking a sample preset contract and triggers analysis", async () => {
    const handleAnalyze = vi.fn();
    render(
      <UploadCard
        onAnalyze={handleAnalyze}
        isLoading={false}
        agentProgressStage=""
      />
    );

    const presetBtn = screen.getByText(/Executive Employment Agreement/i);
    fireEvent.click(presetBtn);

    expect(handleAnalyze).toHaveBeenCalledTimes(1);
    const uploadedFile: File = handleAnalyze.mock.calls[0][0];
    expect(uploadedFile.name).toContain("Executive_Employment_Agreement.docx");
  });

  it("displays progress indicator when loading", () => {
    const handleAnalyze = vi.fn();
    render(
      <UploadCard
        onAnalyze={handleAnalyze}
        isLoading={true}
        agentProgressStage="Clause Extraction Agent running..."
      />
    );

    expect(screen.getByText(/LangGraph Multi-Agent Pipeline Running.../i)).toBeInTheDocument();
    expect(screen.getByText(/Clause Extraction Agent running.../i)).toBeInTheDocument();
  });
});
