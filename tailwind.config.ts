import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#020812",
          900: "#050f1f",
          800: "#0a1628",
        },
        neon: {
          cyan: "#00d4ff",
          blue: "#0ea5e9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(0, 212, 255, 0.45)",
        "glow-sm": "0 0 12px rgba(0, 212, 255, 0.35)",
        card: "0 0 40px rgba(0, 212, 255, 0.15), inset 0 0 60px rgba(0, 212, 255, 0.03)",
      },
      backgroundImage: {
        "gradient-cta":
          "linear-gradient(90deg, #00d4ff 0%, #0ea5e9 50%, #6366f1 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
