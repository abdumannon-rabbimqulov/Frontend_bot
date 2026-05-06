/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#020617',
        card: 'rgba(15,23,42,0.6)',
        border: 'rgba(255,255,255,0.08)',
        primary: '#38bdf8',
        success: '#4ade80',
        danger: '#f87171',
        warning: '#facc15',
        muted: '#94a3b8',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(56,189,248,0.18)',
        glass: '0 25px 50px -12px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};