/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // "Wire" palette - warm amber accent on deep teal-navy ink,
        // shared with the sibling SQLite build of this app.
        ink: {
          900: '#0e1b22',
          800: '#14262f',
          700: '#1c3540',
          600: '#294a57',
        },
        amber: {
          DEFAULT: '#e8a33d',
          dark: '#c9832a',
        },
        sage: '#6fa98c',
        coral: '#e1604f',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Segoe UI', 'sans-serif'],
        body: ['IBM Plex Sans', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      keyframes: {
        rise: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        bounce_dot: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: 0.5 },
          '30%': { transform: 'translateY(-4px)', opacity: 1 },
        },
      },
      animation: {
        rise: 'rise 0.18s ease-out',
        bounce_dot: 'bounce_dot 1.1s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
