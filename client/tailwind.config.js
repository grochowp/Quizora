/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        baseText: "var(--color-text-base)",
        extras: "var(--color-extras)",
        extrasSecondary: "var(--color-extras-secondary)",
        shadow: "var(--color-shadow)",
        gradientSecondary: "var(--color-gradient-secondary)",
      },
    },
  },
  plugins: [],
};
