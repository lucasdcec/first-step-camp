/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#3B82F6',
      },
      fontFamily: {
        sans: ['Poppins', 'Nunito', 'sans-serif'],
      },
      animation: {
        'blink': 'blink 3s infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      keyframes: {
        blink: {
          '0%, 49%, 100%': { opacity: '1' },
          '50%, 99%': { opacity: '0.3' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      boxShadow: {
        device: '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
