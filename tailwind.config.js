/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aether-blue': '#007BFF', // Official Project Blue
      },
      borderRadius: {
        'aether': '8px', // Official 8px Radius
      }
    },
  },
  plugins: [],
}