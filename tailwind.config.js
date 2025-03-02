// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
      themes: ["light", "dark"], // You can customize themes here
    },
  }