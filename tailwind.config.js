module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        solid: "#134C80",
        primarygray: "#F6F6F6",
        textgray: "#333333",
      },
      fontSize: {
        sm: ["12px", "20px"],
        base: ["14px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "32px"],
      },
    },
  },
  plugins: [],
};
