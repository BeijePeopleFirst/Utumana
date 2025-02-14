/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/components/**/*.{html,js,ts,css}", "./src/app/*.{html,js,ts,css}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0e7490', // cyan-800
          dark: '#164e63',
          light: '#0891b2'
        },
        secondary: {
          DEFAULT: '#fb923c', // orange-400
          dark: '#ea580c',  // orange-600
          light: '#f59e0b'  // amber-500
        }, 
        neutral: {
          1: '#fcfcfc', // neutral-50
          2: '#fff7ed'  // orange-50
        }
      }
    }
  },
  plugins: []
};
