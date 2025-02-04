/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/components/**/*.{html,ts,css}"],
  theme: {
    extend: {
      colors: {
        primary: 'black',
        secondary: '#10b981',
      }
    },
  },
  plugins: [],
}
