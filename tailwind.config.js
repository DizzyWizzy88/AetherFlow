/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aether-blue': '#007BFF',
      },
      borderRadius: {
        'aether': '8px',
      }
    },
  },
  plugins: [],
}