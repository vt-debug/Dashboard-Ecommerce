/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Configuração da cor primária (#29e361)
      colors: {
        primary: { 
          '50': '#f0fff4',
          '100': '#e0ffe8',
          '200': '#c2ffd3',
          '300': '#a3ffbe',
          '400': '#72ff9f',
          '500': '#29e361', // A cor principal
          '600': '#22b64d',
          '700': '#1b8a3a',
          '800': '#145d27',
          '900': '#0d3115',
          '950': '#071e0b',
        },
      },
    },
  },
  plugins: [],
}