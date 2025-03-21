import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "`var(--radius)`",
        md: "`calc(var(--radius) - 2px)`",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "hsl(var(--foreground))",
            a: {
              color: "hsl(var(--primary))",
              "&:hover": { color: "hsl(var(--primary))" },
            },
            '[class~="lead"]': { color: "hsl(var(--foreground))" },
            strong: { color: "hsl(var(--foreground))" },
            "ol > li::marker": { color: "hsl(var(--foreground))" },
            "ul > li::marker": { color: "hsl(var(--foreground))" },
            hr: { borderColor: "hsl(var(--border))" },
            blockquote: {
              borderLeftColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
            },
            h1: { color: "hsl(var(--foreground))" },
            h2: { color: "hsl(var(--foreground))" },
            h3: { color: "hsl(var(--foreground))" },
            h4: { color: "hsl(var(--foreground))" },
            "figure figcaption": { color: "hsl(var(--muted-foreground))" },
            code: {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--muted))",
              padding: "0.25rem",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            "a code": { color: "hsl(var(--primary))" },
            pre: {
              backgroundColor: "hsl(var(--muted))",
              color: "hsl(var(--foreground))",
            },
            thead: {
              color: "hsl(var(--foreground))",
              borderBottomColor: "hsl(var(--border))",
            },
            "tbody tr": { borderBottomColor: "hsl(var(--border))" },
          },
        },
      },
      fontFamily: { sans: ["var(--font-sans)", ...fontFamily.sans] },
      keyframes: {
        tilt: {
          "0%, 50%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(0.5deg)" },
          "75%": { transform: "rotate(-0.5deg)" },
        },
      },
      animation: { tilt: "tilt 10s infinite linear" },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
