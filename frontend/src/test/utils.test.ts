import { describe, expect, it } from "vitest";
import { formatSeverityColor } from "../lib/utils";

describe("formatSeverityColor", () => {
  it("returns the expected badge classes for each severity", () => {
    expect(formatSeverityColor("Critical").badge).toContain("bg-red-100");
    expect(formatSeverityColor("High").badge).toContain("bg-orange-100");
    expect(formatSeverityColor("Medium").badge).toContain("bg-amber-100");
    expect(formatSeverityColor("Low").badge).toContain("bg-emerald-100");
  });
});
