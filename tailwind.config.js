/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        bgGreen: '#1C5B20',
        mainTextColor: '#10ff45',
      },
      width:{
        body: '93.75rem',
        mainContent: '59.75rem',
      }
    },
    fontFamily: {
      'home': ['Georgia', 'Impact', 'Arial', 'sans-serif']
    }

  },
  plugins: [],
}
