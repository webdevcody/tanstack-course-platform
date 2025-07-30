/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
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
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        gradient: "gradient 8s linear infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 2s ease-in-out infinite",
        shimmer: "shimmer 6s infinite",
        glow: "glow 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in-top-right": "slideInTopRight 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideInTopRight: {
          "0%": { transform: "translate(100%, -100%)", opacity: "0" },
          "100%": { transform: "translate(0, 0)", opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
        "gradient-red": "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        "gradient-red-hover":
          "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        "gradient-red-transparent":
          "linear-gradient(135deg, #ef4444 0%, transparent 100%)",
        "gradient-red-transparent-hover":
          "linear-gradient(135deg, #dc2626 0%, transparent 100%)",
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(var(--color-theme-500-rgb), 0.3)",
        glow: "0 0 20px rgba(var(--color-theme-500-rgb), 0.4)",
        "glow-lg": "0 0 30px rgba(var(--color-theme-500-rgb), 0.5)",
        "inner-glow": "inset 0 0 20px rgba(var(--color-theme-500-rgb), 0.2)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "elevation-1":
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "elevation-2":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "elevation-3":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
