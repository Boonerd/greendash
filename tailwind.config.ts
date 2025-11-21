import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2E7D32', // Cleaner, natural leaf green
          light: '#4CAF50',
          dark: '#1B5E20',
        },
        cream: {
          DEFAULT: '#F2F0E9', // Slightly darker for better contrast with white cards
          dark: '#EBE5D9',
        },
        lime: {
          DEFAULT: '#C0CA33', // Secondary accent
          hover: '#AFB42B',
        },
        gold: {
          DEFAULT: '#FBC02D', // Rich Gold for "Dash"
          light: '#FDD835',
        },
        earth: '#8D6E63',
        clay: '#D84315'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'sway': 'sway 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      }
    },
  },
  plugins: [],
};
export default config;