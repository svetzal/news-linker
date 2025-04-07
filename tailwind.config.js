/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'canadian-red': '#FF0000',
        'canadian-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
}