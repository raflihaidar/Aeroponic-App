/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './client/src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: '#808080',
      },
    },
  },
  plugins: [import('flowbite/plugin')],
}
