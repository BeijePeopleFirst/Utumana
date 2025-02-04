/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/components/**/*.{html,js,ts,css}", "./src/app/*.{html,js,ts,css}"],
  theme: {
    extend: {
      colors: {
        primary: '#0e7490', // cyan-800
        secondary: '#10b981', // emerald-500
        neutral: {
          1: '#fafafa', // neutral-50
          2: '#ecfeff'  // cyan-50
        }
      }
    }
  },
  plugins: []
};
