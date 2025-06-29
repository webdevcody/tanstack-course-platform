/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
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
    },
  },
};
