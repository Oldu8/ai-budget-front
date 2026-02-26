/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Своя палитра — используй как bg-app-bg, text-app-text, bg-tint и т.д.
      colors: {
        app: {
          bg: "#fff",
          text: "#11181C",
          tint: "#0a7ea4",
          icon: "#687076",
          "icon-muted": "#9BA1A6",
        },
        "app-dark": {
          bg: "#151718",
          text: "#ECEDEE",
          tint: "#fff",
          icon: "#9BA1A6",
        },
      },
    },
  },
  plugins: [],
};
