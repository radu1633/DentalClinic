/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { poppins: ["Poppins", "sans-serif"] },
      colors: {
        primary: "#0055b3",
        secondary: "#00254d",
        dark: "#353e43",
        gray: "#707070",
      },
    },
  },
  plugins: [],
};
