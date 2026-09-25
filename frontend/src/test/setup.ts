import "@testing-library/jest-dom/vitest";

// Mock clipboard safely via Object.defineProperty
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: () => Promise.resolve(),
  },
  writable: true,
  configurable: true,
});
