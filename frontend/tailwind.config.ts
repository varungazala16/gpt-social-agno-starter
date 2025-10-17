import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/preline/preline.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        // Keep existing shadcn colors for compatibility
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // GPT.Social Design System Colors
        primary: {
          DEFAULT: '#7137ff',
          light: '#c6afff',
          foreground: '#ffffff',
        },
        secondary: '#353b41',
        'subtle-prime': '#ebebff',
        success: {
          DEFAULT: '#0ea455',
          light: '#e9faf4',
        },
        info: {
          DEFAULT: '#167ce9',
          light: '#ebf5ff',
        },
        warning: {
          DEFAULT: '#f3a100',
          light: '#fef7e9',
        },
        negative: '#d4191c',
        orangy: '#e96f16',
        primitive: '#f5f5ff',
        gray: {
          25: '#f9faff',
          50: '#f4f7fa',
          100: '#eff2f5',
          200: '#dee4eb',
          300: '#c3ccd6',
          400: '#a8b5c2',
          500: '#8593a3',
          600: '#6a7682',
          700: '#505862',
          800: '#353b41',
          900: '#1b1d21',
          950: '#111317',
        },
        gradient: {
          start: '#aa8fed',
          end: '#760aff',
        },
        teammates: {
          blue: '#1263ba',
          purple: '#442199',
          pink: '#aa3775',
          green: '#086233',
          cyan: '#208a8e',
          yellow: '#d48e00',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
  ],
};
export default config;
