import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf7f2',
          100: '#f5f1e8',
          200: '#ede5d6',
          300: '#dcc9b6',
          400: '#c9b09b',
          500: '#b8967f',
          600: '#a07d68',
          700: '#846654',
          800: '#6d5447',
          900: '#584639',
        },
        accent: {
          50: '#faf8f3',
          100: '#f6f1e8',
          200: '#f0e8d8',
          300: '#e8dac2',
          400: '#dfc8a8',
          500: '#d4b896',
          600: '#c29f7d',
          700: '#a68463',
          800: '#8a6b4f',
          900: '#6f5641',
        },
        terracotta: {
          50: '#faf7f2',
          100: '#f5ede5',
          200: '#e8d4c3',
          300: '#dcbda5',
          400: '#d1a98f',
          500: '#c6947f',
          600: '#b07d6a',
          700: '#976754',
          800: '#7d5544',
          900: '#674836',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        gutter: '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
