/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Defining your project identity for Week 2
        'aether-blue': '#1e40af', 
      },
    },
  },
  plugins: [],
}