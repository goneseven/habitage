/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep forest & botanical greens
        forest: {
          50: '#f2f7f4',
          100: '#e1ede6',
          200: '#c5dcd0',
          300: '#9cc2b1',
          400: '#6ea38d',
          500: '#48856c',
          600: '#346b55',
          700: '#2a5544',
          800: '#234437',
          900: '#1d382e',
          950: '#0c1d17',
        },
        // Botanical Jade
        jade: {
          50: '#effbf5',
          100: '#d7f6e6',
          200: '#b1ebd1',
          300: '#7cdab4',
          400: '#43c092',
          500: '#22a578',
          600: '#168560',
          700: '#146a4e',
          800: '#13543f',
          900: '#114535',
          950: '#05271e',
        },
        // Warm Ivory, Linen & Cream
        ivory: {
          50: '#fcfbf8',
          100: '#f7f5ef',
          200: '#eee9dd',
          300: '#e1dac6',
          400: '#d0c3a8',
          500: '#beaa8a',
          600: '#ab9372',
          700: '#8e795c',
          800: '#74624d',
          900: '#5f5040',
        },
        // Muted Brass & Antique Gold
        brass: {
          50: '#faf7ee',
          100: '#f3ebd4',
          200: '#e7d6a7',
          300: '#dabb74',
          400: '#cca048',
          500: '#c5a059',
          600: '#b38728',
          700: '#946a21',
          800: '#7a5420',
          900: '#67461f',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(12, 29, 23, 0.05), 0 8px 24px -4px rgba(12, 29, 23, 0.07)',
        'elevated': '0 12px 36px -6px rgba(12, 29, 23, 0.12), 0 4px 12px -2px rgba(12, 29, 23, 0.06)',
      },
    },
  },
  plugins: [],
}
