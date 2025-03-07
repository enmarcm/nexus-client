/** @type {import('tailwindcss').Config} */
export default {
  content: [ 
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
    ],
  theme: {
    extend: {
      colors: {
        backgroundWhite: "#F1F4FA",
        primaryLila: "#3A36DB",
        transparentLila: "#3a36db66"

      },
      fontFamily: {
        DM: ["DM Sans", "sans-serif"],
      },
      gridTemplateColumns:{
        "30-60": "30% 60%",
      },
      
    },
  },
  plugins: [],
}





