/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "red", // Blu personalizzato
        secondary: "#9333EA", // Viola personalizzato
        accent: "#F59E0B", // Arancione acceso
      },
    },
  },
  plugins: [],
}

