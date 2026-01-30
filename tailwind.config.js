/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB'
        },
        secondary: '#06b6d4',
        accent: '#22d3ee',
        background: {
          DEFAULT: '#0a0a0f',
          card: 'rgba(255, 255, 255, 0.03)',
          'card-hover': 'rgba(255, 255, 255, 0.06)'
        },
        foreground: {
          DEFAULT: '#f8fafc',
          muted: '#94a3b8'
        },
        border: 'rgba(255, 255, 255, 0.1)'
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
        glow: '0 0 20px rgba(59, 130, 246, 0.1)',
      }
    }
  },
  plugins: []
}
