module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-primary',
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    'focus:ring-primary',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e4d9e',
        secondary: '#a3c4e9',
        accent: '#7d56a7',
        background: '#f4f7fc',
        foreground: '#213448',
      },
    },
  },
  plugins: [],
};
