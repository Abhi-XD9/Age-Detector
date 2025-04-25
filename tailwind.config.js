/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': {'min': '0px', 'max': '500px'}, // Custom breakpoint for 0 to 500px
      },
    },
  },
  plugins: [],
}