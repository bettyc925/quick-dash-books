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
        qb: {
          blue: "hsl(var(--qb-blue))",
          "blue-light": "hsl(var(--qb-blue-light))",
          "blue-dark": "hsl(var(--qb-blue-dark))",
          accent: "hsl(var(--qb-accent))",
          orange: "hsl(var(--qb-orange))",
          teal: "hsl(var(--qb-teal))",
          purple: "hsl(var(--qb-purple))",
          "gray-50": "hsl(var(--qb-gray-50))",
          "gray-100": "hsl(var(--qb-gray-100))",
          "gray-200": "hsl(var(--qb-gray-200))",
          "gray-300": "hsl(var(--qb-gray-300))",
          "gray-400": "hsl(var(--qb-gray-400))",
          "gray-600": "hsl(var(--qb-gray-600))",
          "gray-700": "hsl(var(--qb-gray-700))",
          "gray-800": "hsl(var(--qb-gray-800))",
        },
      },
      backgroundImage: {
        "gradient-qb": "var(--gradient-qb)",
        "gradient-card": "var(--gradient-card)",
        "gradient-sidebar": "var(--gradient-sidebar)",
        "gradient-accent": "var(--gradient-accent)",
      },
      boxShadow: {
        "qb-sm": "var(--shadow-sm)",
        "qb-md": "var(--shadow-md)",
        "qb-lg": "var(--shadow-lg)",
        "qb-glow": "var(--shadow-glow)",
      },
      transitionProperty: {
        smooth: "var(--transition-smooth)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
