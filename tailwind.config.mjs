import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [require("tailwindcss-animate"),
    heroui({
      themes: {
        light: {
          colors: {
            background: "#fafafa",
            foreground: "#0f0f1a",
            primary: {
              DEFAULT: "#22d3ee",
              foreground: "#0f0f1a",
            },
            secondary: {
              DEFAULT: "#f472b6",
              foreground: "#0f0f1a",
            },
            success: {
              DEFAULT: "#4ade80",
              foreground: "#0f0f1a",
            },
            warning: {
              DEFAULT: "#facc15",
              foreground: "#0f0f1a",
            },
            danger: {
              DEFAULT: "#f87171",
              foreground: "#fafafa",
            },
          },
        },
        dark: {
          colors: {
            background: "#000000",
            foreground: "#fafafa",
            primary: {
              DEFAULT: "#00cacb",
              foreground: "#0f0f1a",
            },
            secondary: {
              DEFAULT: "#f472b6",
              foreground: "#0f0f1a",
            },
            success: {
              DEFAULT: "#4ade80",
              foreground: "#0f0f1a",
            },
            warning: {
              DEFAULT: "#facc15",
              foreground: "#0f0f1a",
            },
            danger: {
              DEFAULT: "#f87171",
              foreground: "#fafafa",
            },
          },
        },
      },
    }),
  ],
}

export default config;