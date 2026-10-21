/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#080d1a',
          surface: '#0f172a',
          card: '#131b2e',
          cardHover: '#18223a',
          border: '#1e293b',
          borderLight: '#2a3754',
          sidebar: '#0a0f1d',
        },
        trade: {
          win: '#10b981',
          winBg: 'rgba(16, 185, 129, 0.12)',
          loss: '#ef4444',
          lossBg: 'rgba(239, 68, 68, 0.12)',
          be: '#f59e0b',
          beBg: 'rgba(245, 158, 11, 0.12)',
          accent: '#6366f1',
          accentHover: '#4f46e5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
