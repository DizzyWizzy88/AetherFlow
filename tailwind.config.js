/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/components/ui/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "0.5rem", // Standard 8px branding requirement
      },
      colors: {
        aetherBlue: "#007BFF",    // Custom branding primary token
        crimsonAlert: "#D50000",  // Custom low-stock alert token
      },
    },
  },
  plugins: [],
}