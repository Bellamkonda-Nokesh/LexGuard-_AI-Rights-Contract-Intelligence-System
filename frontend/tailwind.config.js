/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f6fa",
        surface: "#ffffff",
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        navy: {
          900: "#131728",
          850: "#181d34",
          800: "#1e2238",
          700: "#2a2f4c",
        },
        slate: {
          850: "#181d2f",
          950: "#0b0f19",
        },
        accent: {
          purple: "#8b5cf6",
          blue: "#3b82f6",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        }
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -1px rgba(27, 36, 68, 0.04), 0 1px 3px -1px rgba(27, 36, 68, 0.02)',
        'soft': '0 10px 30px -4px rgba(27, 36, 68, 0.06), 0 4px 12px -2px rgba(27, 36, 68, 0.03)',
        'soft-lg': '0 20px 40px -6px rgba(27, 36, 68, 0.09), 0 8px 16px -3px rgba(27, 36, 68, 0.04)',
        'card-glow': '0 12px 32px -4px rgba(79, 70, 229, 0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
