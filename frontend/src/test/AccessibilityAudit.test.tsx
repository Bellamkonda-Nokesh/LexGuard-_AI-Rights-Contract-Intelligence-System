import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { Navbar } from "../components/Navbar";
import { RiskGauge } from "../components/RiskGauge";

describe("Automated Accessibility Audit (axe-core)", () => {
  it("verifies DisclaimerBanner has no accessibility violations", async () => {
    const { container } = render(<DisclaimerBanner />);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("verifies Navbar has no accessibility violations", async () => {
    const { container } = render(
      <Navbar
        currentTab="analyze"
        setCurrentTab={() => {}}
        user={null}
        onLogin={() => {}}
        onLogout={() => {}}
      />
    );
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("verifies RiskGauge has no accessibility violations", async () => {
    const { container } = render(
      <RiskGauge
        score={75}
        level="High"
        headline="Significant Contractual Liabilities"
        executiveSummary="Executive risk summary."
        totalClauses={5}
        flaggedClauses={3}
        severityBreakdown={{ Critical: 1, High: 2, Medium: 0, Low: 2 }}
      />
    );
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
