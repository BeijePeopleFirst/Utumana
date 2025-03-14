function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/components/**/*.{html,js,ts,css}", "./src/app/*.{html,js,ts,css}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: withOpacity("--primary-default"), //'#0e7490', // cyan-800
          dark: withOpacity("--primary-dark"),
          light: withOpacity("--primary-light")
        },
        secondary: {
          DEFAULT: withOpacity("--secondary-default"), // orange-400
          dark: withOpacity("--secondary-dark"),  // orange-600
          light: withOpacity("--secondary-light")  // amber-500
        }, 
        neutral: {
          1: withOpacity("--neutral-1"), // neutral-50
          2: withOpacity("--neutral-2")  // orange-50
        }
      }
    }
  },
  plugins: []
};
