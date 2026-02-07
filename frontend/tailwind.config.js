/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stellar: {
          purple: '#7B2CBF',
          blue: '#3A0CA3',
          light: '#F72585',
        }
      }
    },
  },
  plugins: [],
}
