/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f6',
          100: '#fbe4ec',
          200: '#f6c9d9',
          300: '#ec9bb8',
          400: '#de6491',
          500: '#c93a6c',
          600: '#a72353',
          700: '#7a1f3d',
          800: '#5f172f',
          900: '#3f0f1f',
        },
        gold: {
          100: '#fdf4dc',
          200: '#f7e3ae',
          300: '#eecd75',
          400: '#e0b647',
          500: '#c99b2b',
          600: '#a67c1d',
        },
        ink: {
          900: '#161318',
          700: '#3b3540',
          500: '#6b6472',
          300: '#a49dab',
        },
        canvas: '#f4f1f3',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 19, 24, 0.06), 0 8px 24px -16px rgba(22, 19, 24, 0.35)',
        lift: '0 12px 32px -12px rgba(122, 31, 61, 0.28)',
        pop: '0 24px 60px -24px rgba(22, 19, 24, 0.45)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
