/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary greens
        forest: {
          DEFAULT: '#1a4d2e',
          light: '#2d6a4f',
          dark: '#0d3d26',
        },
        lime: {
          DEFAULT: '#a3d977',
          light: '#b8e394',
          dark: '#8fb339',
        },
        
        // Neutrals
        cream: {
          DEFAULT: '#F5F1E8',
          light: '#FAF8F4',
          dark: '#EBE5D9',
        },
        
        // Accents
        gold: {
          DEFAULT: '#D4A373',
          light: '#F4C430',
          dark: '#B8860B',
        },
        
        // Additional colors
        meadow: '#74C69D',
        sage: '#95D5B2',
        earth: '#8D6E63',
        clay: '#D84315',
      },
      
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'sway': 'sway 3s ease-in-out infinite',
        'bounce': 'bounce 1s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounce: {
          '0%, 100%': { 
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': { 
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      
      boxShadow: {
        'forest': '0 4px 14px rgba(26, 77, 46, 0.15)',
        'lime': '0 4px 14px rgba(163, 217, 119, 0.25)',
        'gold': '0 4px 14px rgba(212, 163, 115, 0.25)',
      },
    },
  },
  plugins: [],
}