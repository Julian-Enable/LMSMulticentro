/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8e9f2',
          100: '#d1d3e5',
          200: '#a3a7cb',
          300: '#757bb1',
          400: '#474f97',
          500: '#2c3166',
          600: '#232752',
          700: '#1a1d3e',
          800: '#12142a',
          900: '#090a15',
        },
        accent: {
          50: '#fce8e9',
          100: '#f9d1d3',
          200: '#f3a3a7',
          300: '#ed757b',
          400: '#e7474f',
          500: '#b72c34',
          600: '#92232a',
          700: '#6e1a20',
          800: '#491215',
          900: '#25090b',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px -2px rgba(44, 49, 102, 0.1), 0 12px 30px -4px rgba(44, 49, 102, 0.08)',
        'strong': '0 10px 40px -5px rgba(44, 49, 102, 0.2), 0 20px 50px -8px rgba(44, 49, 102, 0.15)',
      },
    },
  },
  plugins: [],
}
