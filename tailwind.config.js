/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          dark: 'rgb(var(--primary-dark) / <alpha-value>)'
        },
        secondary: '#06b6d4',
        accent: '#22d3ee',
        background: {
          DEFAULT: 'rgb(var(--background) / <alpha-value>)',
          card: 'rgb(var(--background-card) / var(--background-card-alpha))',
          'card-hover': 'rgb(var(--background-card) / var(--background-card-hover-alpha))'
        },
        foreground: {
          DEFAULT: 'rgb(var(--foreground) / <alpha-value>)',
          muted: 'rgb(var(--foreground-muted) / <alpha-value>)'
        },
        subtle: 'rgb(var(--foreground) / var(--subtle-alpha))',
        border: 'rgb(var(--border) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Satoshi', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '16px',
        sm: '8px'
      },
      boxShadow: {
        glow: '0 0 20px rgb(var(--primary) / var(--shadow-glow-alpha))',
      }
    }
  },
  plugins: []
}
