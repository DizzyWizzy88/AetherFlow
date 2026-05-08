/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'aether-blue': '#0D47A1',   
        'cloud-gray': '#F5F5F5',    
      },
      borderRadius: {
        'aether': '8px', 
      }
    },
  },
  plugins: [],
}