/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // Add other paths if necessary
  ],
  theme: {
    extend: {
      screens: { // screens object starts here
        'xs': '400px', // Add your custom breakpoint here
      }, // screens object ends here
      colors: { // colors object should be here, directly under extend
        'brand-green': {
          light: '#A3D9A5',
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
        },
        'brand-background': '#F4FBF4', // Now correctly defined
        'brand-text': '#333333',
        'brand-border': '#D1E7D3',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'), // Add this line
  ],
}

