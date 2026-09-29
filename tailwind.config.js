/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: '#090e17',     // Deep Obsidian Slate
          navy: '#0f2042',     // Sovereign Executive Navy
          slate: '#1e293b',    // Slate 800
          surface: '#f8fafc',  // Clean Executive Canvas
          subtle: '#f1f5f9',   // Light border accent
          border: '#e2e8f0',   // Hairline neutral border
          primary: '#1d4ed8',  // Official Blue
          cobalt: '#2563eb',   // Electric interactive blue
          emerald: '#059669',  // Fast lane emerald
          amber: '#d97706',    // Standard lane warm ochre
          purple: '#7c3aed',   // Review lane royal violet
          danger: '#dc2626',   // Violation crimson
          muted: '#64748b',    // Supporting metadata
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)',
        'elevated': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'paper': '0 20px 40px -15px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(15, 23, 42, 0.05)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
      }
    },
  },
  plugins: [],
}
