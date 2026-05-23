import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#faf7f2",
        foreground: "#333333",
        surface: "#ffffff",
        primary: {
          DEFAULT: "#313b30",
          dark: "#232d22",
        },
        secondary: {
          DEFAULT: "#c39a5c",
          hover: "#e0b472",
        },
        text: {
          main: "#333333",
          muted: "#666666",
          light: "#a0a0a0",
        },
        border: "#e2dfd9",
        "dark-olive": "#1a201a",
        "dark-olive-2": "#2b3629",
        "dark-olive-3": "#4a5c46",
        "dark-olive-4": "#5c7257",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
        "3xl": "3rem",
        "4xl": "4rem",
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
      },
      fontFamily: {
        sans: [
          'var(--font-montserrat)',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        serif: [
           'var(--font-montserrat)',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        "geist-sans": "var(--font-geist-sans)",
      },
      backgroundImage: {
        "gradient-white-transparent": "linear-gradient(to right, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 40%, rgba(255, 255, 255, 0) 100%)",
      },
      transitionDuration: {
        normal: "0.2s",
        fast: "0.1s",
      },
    },
  },
  plugins: [],
};
export default config;
