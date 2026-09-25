import "@testing-library/jest-dom/vitest";

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
});
