/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Kakao Brand Colors
        primary: {
          50: '#fffde7',
          100: '#fff9c4',
          200: '#fff59d',
          300: '#fff176',
          400: '#ffee58',
          500: '#fee500', // Main Brand Color
          600: '#fdd835',
          700: '#fbc02d',
          800: '#f9a825',
          900: '#f57f17',
        },
        // Grayscale Colors
        secondary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        // Semantic Colors
        background: '#f2f4f6',
        surface: '#ffffff',
        error: '#ef4444',
        success: '#10b981',

        // Legacy Dark Scale (Mapped to Light Theme)
        dark: {
          50: '#191f28', // Main Text
          100: '#333d4b',
          200: '#4e5968',
          300: '#596574',
          400: '#7b8694',
          500: '#b0b8c1',
          600: '#d1d6db',
          700: '#e5e8eb',
          800: '#ffffff', // Card/Surface White
          900: '#f2f4f6', // App Background
          950: '#ffffff',
        },
        // Stock Accents
        accent: {
          bull: '#10b981', // 상승
          bear: '#ef4444', // 하락
          neutral: '#6b7280', // 보합
        },
      },
      fontFamily: {
        sans: [
          'NanumSquareNeo',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
      spacing: {
        header: '56px',
        footer: '72px',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.05)',
        glow: '0 0 20px rgba(254, 229, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(254, 229, 0, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(254, 229, 0, 0.4)' },
        },
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
