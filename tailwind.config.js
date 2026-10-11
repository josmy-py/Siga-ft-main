/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  // AÑADE ESTO: Es lo que evita que los botones de primevue pierdan el fondo
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors:{
        primary: "#0F172A",
        secondary: "#1E293B",
        accent: "#3B82F6",
      }
    },
  },
  plugins: [],
}
