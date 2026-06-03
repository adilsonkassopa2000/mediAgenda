/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './admin.html',
    './medico.html',
    './patient-dashboard.html',
    './sign-up-login-screen.html',
    './lading-page.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", 'sans-serif'],
      },
      colors: {
        brand: '#C0152B',
        'brand-dark': '#a01224',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.06)',
      },
    }
  },
  plugins: [],
}
