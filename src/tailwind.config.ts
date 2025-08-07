
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'border-shine': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 2px var(--glow-color), 0 0 5px var(--glow-color), 0 0 10px var(--glow-color)' },
          '50%': { boxShadow: '0 0 5px var(--glow-color), 0 0 15px var(--glow-color), 0 0 25px var(--glow-color)' },
        },
        'multi-color-glow': {
            '0%': {
                boxShadow: '0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary) / 0.8), 0 0 15px hsl(var(--primary) / 0.6)',
            },
            '50%': {
                boxShadow: '0 0 5px hsl(var(--accent)), 0 0 10px hsl(var(--accent) / 0.8), 0 0 15px hsl(var(--accent) / 0.6)',
            },
            '100%': {
                boxShadow: '0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary) / 0.8), 0 0 15px hsl(var(--primary) / 0.6)',
            },
        },
        'background-pan': {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% -200%' },
        },
        'snap-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '80%': { transform: 'scale(1.02) translateY(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        glitch: {
            '0%, 100%': {
                textShadow: '-1.5px -1.5px 0 hsl(var(--accent)), 1.5px 1.5px 0 hsl(var(--primary))',
                clipPath: 'inset(50% 0 30% 0)',
            },
            '25%': {
                clipPath: 'inset(15% 0 70% 0)',
            },
            '50%': {
                clipPath: 'inset(80% 0 5% 0)',
            },
            '75%': {
                clipPath: 'inset(45% 0 45% 0)',
            },
        },
        'zoom-in-out-glow': {
          '0%, 100%': {
            transform: 'scale(1)',
            textShadow: '0 0 4px hsl(var(--primary) / 0.8), 0 0 8px hsl(var(--primary) / 0.6)',
          },
          '50%': {
            transform: 'scale(1.05)',
            textShadow: '0 0 6px hsl(var(--accent) / 0.8), 0 0 12px hsl(var(--accent) / 0.6)',
          },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'border-shine': 'border-shine 2s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'multi-color-glow': 'multi-color-glow 4s ease-in-out infinite',
        'background-pan': 'background-pan 30s linear infinite',
        'snap-in': 'snap-in 0.5s ease-out',
        'typing': 'typing 1s steps(40, end)',
        'glitch': 'glitch 0.4s linear infinite',
        'zoom-in-out-glow': 'zoom-in-out-glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
