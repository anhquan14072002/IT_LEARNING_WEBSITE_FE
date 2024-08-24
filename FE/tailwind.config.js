/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-purple": "#081A51",
        "light-white": "rgba(255,255,255,0.17)",
      },
      width: {
        '18p': '19%', 
        '24p': '24%', 
        '32p': '32%',
        '49p': '49%', 
      },
    },
  },
  plugins: [],
}