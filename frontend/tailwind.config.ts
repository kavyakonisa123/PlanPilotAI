import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        ocean: "#1f6f8b",
        coral: "#f26d5b",
        moss: "#5b8c5a",
        skywash: "#edf7fb",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 33, 43, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
