/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       keyframes : {
          translate : {
             'from' : {transform : 'translateY(-10px)'},
             'to' : {transform : 'translateY(0px)'},
          }
       },
       animation: {
          spin: 'spin .5s linear infinite',
          translate : 'translate .5s ease infinite'
       }
    },
  },
  plugins: [],
}