/**
 * CONFIGURACIÓN DE TAILWIND CSS PARA FLAMA
 * 
 * Este archivo contiene la configuración personalizada de Tailwind CSS
 * para el sitio web de FLAMA, incluyendo colores, fuentes y extensiones.
 */

module.exports = {
  content: [
    "./index.html",
    "./productos.js",
    "./styles.css"
  ],
  theme: {
    extend: {
      colors: {
        'neon-orange': '#ff6b35',
        'neon-red': '#ff073a',
        'dark-gray': '#1a1a1a',
        'medium-gray': '#2d2d2d',
        'flama-orange': '#ff6b35',
        'flama-dark': '#1a1a1a',
        'flama-light': '#f9fafb',
      },
      fontFamily: {
        'urban': ['Impact', 'Arial Black', 'sans-serif'],
        'flama': ['Impact', 'Arial Black', 'sans-serif'],
      },
      animation: {
        'flama-glow': 'flama-glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.8s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'flama-glow': {
          '0%': {
            textShadow: '0 0 20px rgba(255, 107, 53, 0.5)',
          },
          '100%': {
            textShadow: '0 0 30px rgba(255, 107, 53, 0.8), 0 0 40px rgba(255, 107, 53, 0.3)',
          },
        },
        'fadeIn': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      boxShadow: {
        'flama': '0 0 20px rgba(255, 107, 53, 0.3)',
        'flama-hover': '0 0 30px rgba(255, 107, 53, 0.5)',
        'flama-glow': '0 0 15px rgba(255, 107, 53, 0.4)',
      },
      backgroundImage: {
        'flama-gradient': 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(255,107,53,0.1) 100%)',
        'orange-gradient': 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontSize: {
        '10xl': '10rem',
        '11xl': '12rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Plugin personalizado para efectos de FLAMA
    function({ addUtilities }) {
      const newUtilities = {
        '.text-flama-glow': {
          textShadow: '0 0 20px rgba(255, 107, 53, 0.5)',
        },
        '.bg-flama-pattern': {
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)',
        },
        '.border-flama': {
          borderColor: '#ff6b35',
        },
        '.shadow-flama': {
          boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} 