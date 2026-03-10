/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./providers/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Custom palette — use as bg-app-bg, text-app-text, bg-tint, etc.
      colors: {
        app: {
          bg: "#fff",
          text: "#11181C",
          tint: "#0a7ea4",
          icon: "#687076",
          "icon-muted": "#9BA1A6",
        },
        brand: {
          // Primary brand colors
          primary: "#005451",
          "primary-hover": "#00B9B3",
          "primary-active": "#81DACA",
          // Neutral palette
          black: "#000000",
          grey: "#9B938F",
          "grey-hover": "#EDE7DF",
          "grey-low": "#F7F5F3",
          white: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
