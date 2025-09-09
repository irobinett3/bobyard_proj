import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"], // scan files
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#16a34a" },
        primaryFg: "#0b5d2a",
        bg: "#ffffff",
        fg: "#213547",
        card: "#ffffff",
        cardFg: "#213547",
        border: "#e5e7eb",
        muted: "#6b7280",
        brand: { DEFAULT: "#16a34a", fg: "#0b5d2a", light: "#bbf7d0" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"], // sans stack
        serif: ["Merriweather", "ui-serif", "Georgia"], // serif stack
        display: ["Merriweather", "serif"], // display font
        body: ["Inter", "sans-serif"], // body font
      },
    },
  },
  plugins: [
    // add extra plugins here
    // require("@tailwindcss/line-clamp"),
  ],
};

export default config;