import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090A0E",
        surface: "#12141C",
        surfaceBorder: "#212433",
        brand: {
          red: "#E50914",
          redHover: "#B80710",
        }
      },
    },
  },
  plugins: [],
};
export default config;