/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'gh-dark-bg': '#0d1117',
        'gh-dark-subtle': '#161b22',
        'gh-dark-hover': '#21262d',
        'gh-dark-border': '#30363d',
        'gh-dark-fg': '#c9d1d9',
        'gh-dark-secondary': '#8b949e',
        'gh-dark-muted': '#6e7681',
        'gh-dark-primary': '#58a6ff',
        'gh-dark-danger': '#f85149',
        'gh-dark-success': '#3fb950',
        'gh-dark-warning': '#d29922',
      }
    }
  },
  separator: '_',
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
};
