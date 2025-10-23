module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        colors: {
          brand: {
            blue: "#2563eb",
            yellow: "#facc15"
          }
        }
      },
      animation: {
        spin: 'spin 1s linear infinite',
      },
      // ------------------------
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Add this section
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        }
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}

// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     require('@tailwindcss/typography'), // You should already have this
//     require('@tailwindcss/gradient-conic'), // <-- ADD THIS LINE
//   ],
// }