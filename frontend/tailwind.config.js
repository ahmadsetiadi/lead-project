/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",   // penting: scan semua file Angular
  ],
  theme: {
    extend: {
      colors: {
        dashboard: {
          gray: "#1A2234",
          dark: "#0D1117",
          black: "#101828",
          green: "#4ade80",
          blue: "#60A5FA",
          red: "#F87171",
          yellow: "#EAB308",
          yellowlight: "#EAB30833"
        }        
      }
    },
  },
  plugins: [],
}
