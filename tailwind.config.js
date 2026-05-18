/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        terracotta: '#C45C26',
        sage: '#8BA18E',
        cream: '#F7F6F0',
        charcoal: '#2D312B',
        muted: '#666666'
      },
      fontFamily: {
        'display': ['Cormorant Garamond', 'serif'],
        'body': ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: [],
}
