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
        uai: {
          500: '#FFBF1A',
          600: '#FF9F00',
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
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
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
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateX(-30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "counter": {
          "0%": {
            opacity: "0",
            transform: "scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "glow": {
          "0%, 100%": {
            boxShadow: "0 0 25px rgba(255, 255, 255, 0.4), 0 0 50px rgba(255, 255, 255, 0.2)",
          },
          "50%": {
            boxShadow: "0 0 35px rgba(255, 255, 255, 0.6), 0 0 70px rgba(255, 255, 255, 0.3)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 10px 15px -3px rgba(250, 204, 21, 0.3), 0 4px 6px -2px rgba(250, 204, 21, 0.2)"
          },
          "50%": {
            transform: "scale(1.05)",
            boxShadow: "0 20px 25px -5px rgba(250, 204, 21, 0.5), 0 10px 10px -5px rgba(250, 204, 21, 0.3)"
          }
        },
        "sound-wave": {
          "0%": {
            transform: "scale(1)",
            opacity: "0.6"
          },
          "100%": {
            transform: "scale(2)",
            opacity: "0"
          }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) translateX(0)", opacity: "0.4" },
          "50%": { transform: "translateY(-30px) translateX(15px)", opacity: "0.8" },
        },
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "0.3" },
          "75%, 100%": { transform: "scale(1.8)", opacity: "0" },
        },
        "spin-slow": {
          "from": { transform: "rotate(0deg)" },
          "to": { transform: "rotate(360deg)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
        "counter": "counter 2s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "sound-wave": "sound-wave 1.5s ease-out infinite",
        "float": "float 6s ease-in-out infinite",
        "ping-slow": "ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "shimmer": "shimmer 2s infinite",
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--foreground) / 0.9)',
            '--tw-prose-headings': 'hsl(var(--foreground))',
            '--tw-prose-lead': 'hsl(var(--muted-foreground))',
            '--tw-prose-links': 'hsl(var(--accent))',
            '--tw-prose-bold': 'hsl(var(--foreground))',
            '--tw-prose-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-bullets': 'hsl(var(--accent))',
            '--tw-prose-hr': 'hsl(var(--border))',
            '--tw-prose-quotes': 'hsl(var(--foreground))',
            '--tw-prose-quote-borders': 'hsl(var(--accent))',
            '--tw-prose-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-code': 'hsl(var(--accent))',
            '--tw-prose-pre-code': 'hsl(var(--foreground))',
            '--tw-prose-pre-bg': 'hsl(var(--muted))',
            '--tw-prose-th-borders': 'hsl(var(--border))',
            '--tw-prose-td-borders': 'hsl(var(--border))',
            'maxWidth': 'none',
            'p': {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              lineHeight: '1.75',
            },
            'h2': {
              fontSize: '1.75rem',
              fontWeight: '700',
              marginTop: '2em',
              marginBottom: '1em',
              color: 'hsl(var(--foreground))',
            },
            'h3': {
              fontSize: '1.5rem',
              fontWeight: '600',
              marginTop: '1.6em',
              marginBottom: '0.8em',
              color: 'hsl(var(--foreground))',
            },
            'a': {
              color: 'hsl(var(--accent))',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s',
              '&:hover': {
                color: 'hsl(var(--accent) / 0.8)',
                textDecoration: 'underline',
              },
            },
            'ul': {
              paddingLeft: '1.625em',
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            'ol': {
              paddingLeft: '1.625em',
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            'li': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'li::marker': {
              color: 'hsl(var(--accent))',
            },
            'strong': {
              color: 'hsl(var(--foreground))',
              fontWeight: '600',
            },
            'blockquote': {
              fontWeight: '400',
              fontStyle: 'italic',
              color: 'hsl(var(--foreground))',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'hsl(var(--accent))',
              paddingLeft: '1em',
              marginTop: '1.6em',
              marginBottom: '1.6em',
            },
            'code': {
              color: 'hsl(var(--accent))',
              fontWeight: '500',
              fontSize: '0.875em',
              backgroundColor: 'hsl(var(--muted))',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            'pre': {
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              marginTop: '1.75em',
              marginBottom: '1.75em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': 'hsl(var(--foreground) / 0.9)',
            '--tw-prose-headings': 'hsl(var(--foreground))',
            '--tw-prose-links': 'hsl(var(--accent))',
            '--tw-prose-bold': 'hsl(var(--foreground))',
            '--tw-prose-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-bullets': 'hsl(var(--accent))',
            '--tw-prose-hr': 'hsl(var(--border))',
            '--tw-prose-quotes': 'hsl(var(--foreground))',
            '--tw-prose-quote-borders': 'hsl(var(--accent))',
            '--tw-prose-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-code': 'hsl(var(--accent))',
            '--tw-prose-th-borders': 'hsl(var(--border))',
            '--tw-prose-td-borders': 'hsl(var(--border))',
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;
