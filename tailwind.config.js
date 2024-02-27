/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        bgGreen: '#4E8A3E',
        mainTextColor: '#10ff45',
      }
    },
    fontFamily: {
      'home': ['Georgia', 'Impact', 'Arial', 'sans-serif']
    }

  },
  plugins: [],
}
