// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // ← MUST HAVE
    "./pages/**/*.{js,ts,jsx,tsx}", // ← if you have pages
    "./components/**/*.{js,ts,jsx,tsx}", // ← MUST HAVE
    "./src/**/*.{js,ts,jsx,tsx}", // ← if you have src folder
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // ← if using tremor
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
