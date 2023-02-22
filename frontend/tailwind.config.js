/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       'spin': 'spin 1s ease-in-out infinite',
       'translateFromY' : 'translateFromY 1s ease-in infinite'
    },
  },
  plugins: [],
}