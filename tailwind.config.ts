import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Crimson Text', 'Times New Roman', 'serif'],
      },
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
        paper: "hsl(var(--paper))",
        spine: "hsl(var(--spine))",
        ink: "hsl(var(--ink))",
        gold: "hsl(var(--gold))",
        burgundy: "hsl(var(--burgundy))",
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
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "page-turn-forward": {
          "0%": {
            transform: "rotateY(0deg)",
            boxShadow: "0 0 0 0 rgba(0,0,0,0)",
          },
          "50%": {
            transform: "rotateY(-90deg)",
            boxShadow: "-10px 0 30px -5px rgba(0,0,0,0.3)",
          },
          "100%": {
            transform: "rotateY(-180deg)",
            boxShadow: "0 0 0 0 rgba(0,0,0,0)",
          },
        },
        "page-turn-backward": {
          "0%": {
            transform: "rotateY(-180deg)",
            boxShadow: "0 0 0 0 rgba(0,0,0,0)",
          },
          "50%": {
            transform: "rotateY(-90deg)",
            boxShadow: "-10px 0 30px -5px rgba(0,0,0,0.3)",
          },
          "100%": {
            transform: "rotateY(0deg)",
            boxShadow: "0 0 0 0 rgba(0,0,0,0)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "content-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "page-turn-forward": "page-turn-forward 0.6s ease-in-out forwards",
        "page-turn-backward": "page-turn-backward 0.6s ease-in-out forwards",
        "page-turn-backward-reverse": "page-turn-backward 0.6s ease-in-out reverse forwards",
        "fade-in": "fade-in 0.4s ease-out",
        "content-fade": "content-fade 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
