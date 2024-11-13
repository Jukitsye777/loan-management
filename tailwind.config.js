/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {

      colors: {
        beige: '#F2E4D8',      // Background color
        brown: '#7A4B27',      // Header text and button color
        lightBrown: '#D3B89C', // Tab background and table header
        tan: '#D3B89C',        // Same as light brown (for variations)
      },
    },
  },
  plugins: [],
}

