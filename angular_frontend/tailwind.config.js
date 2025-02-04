/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/components/**/*.{html,js,ts,css}","./src/app/*.{html,js,ts,css}"],
  theme: {
    extend: {
      colors: {
        primary: 'cyan-800',
        secondary: '#10b981',
		neutral: {
			1: 'neutral-50',
			2: 'cyan-50'
		}
      }
    },
  },
  plugins: [],
}
