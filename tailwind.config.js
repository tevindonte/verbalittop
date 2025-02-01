/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'BluuSuperstar' : 'BluuSuperstar',
        'SecularOne' : 'SecularOne',
      },
      colors : {
        primary : '#06283D',
        secondary : 'gray'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
],
}
