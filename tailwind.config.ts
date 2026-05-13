import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#030711",
      },
      boxShadow: {
        neon: "0 0 60px rgba(34, 211, 238, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
