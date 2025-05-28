/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'off-white': '#F8F9FA',
        'warm-gray': '#E0E0E0',
        'charcoal': '#333333',
        'coral': {
          DEFAULT: '#FF6B6B',
          light: '#FF8787'
        },
        'teal': {
          DEFAULT: '#4ECDC4',
          deep: '#3AA8A0'
        },
        'mustard': {
          DEFAULT: '#FFC107',
          soft: '#FFD54F'
        },
        
        // Dark mode colors
        'dark-gray': '#1A1A1A',
        'midnight-gray': '#2D2D2D',
        'soft-white': '#E6E6E6',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}