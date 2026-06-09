/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#005091",
        "natural-sky-blue": "#A8D0FF",
        "natural-grey-blue": "#E2F1FF",
        "natural-white": "#FFFFFF",
        "natural-black": "#000000",
        "accent-red": "#E04040",
        "light-purple-blue": "#5281C7",
        "dark-purple-blue": "#3D70B5",
        "tinted-white-blue": "#F8F8FF",
        "dark-brown": "#404756",
        "accent-grey": "#A0A0A0",
        "purple-highlight": "#DDDCFF",
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
      },

      fontSize: {
        "preset-display": [
          "60px",
          { lineHeight: "30px", letterSpacing: "0.0015em" },
        ],
        "preset-title": [
          "32px",
          { lineHeight: "40px", letterSpacing: "0.0015em" },
        ],
        "preset-sub-title": [
          "22px",
          {
            lineHeight: "28.6px",
            letterSpacing: "0.0015em",
          },
        ],
        "preset-body": [
          "16px",
          {
            lineHeight: "25.6px",
            letterSpacing: "0.0015em",
          },
        ],
        "preset-ui": [
          "14px",
          {
            lineHeight: "19.6px",
            letterSpacing: "0.0015em",
          },
        ],
        "preset-caption": [
          "12px",
          {
            lineHeight: "15.6px",
            letterSpacing: "0.0015em",
          },
        ],
      },
    },
  },
  plugins: [],
};
