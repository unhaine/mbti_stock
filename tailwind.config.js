/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary - Red Theme (미니멀, 세련됨)
        primary: {
          50: '#FEF2F2',   // 가장 밝은 빨간색 (호버 배경)
          100: '#FEE2E2',  // 연한 빨간색 (선택 배경)
          200: '#FECACA',  // 밝은 빨간색
          300: '#FCA5A5',  // 중간 밝은 빨간색
          400: '#F87171',  // 중간 빨간색
          500: '#EF4444',  // 메인 브랜드 빨간색
          600: '#DC2626',  // 진한 빨간색 (호버)
          700: '#B91C1C',  // 더 진한 빨간색
          800: '#991B1B',  // 매우 진한 빨간색
          900: '#7F1D1D',  // 가장 진한 빨간색
        },
        // Grayscale Colors (neutral)
        secondary: {
          50: '#F9FAFB',   // 2차 배경
          100: '#F3F4F6',  // 구분선
          200: '#E5E7EB',  // 호버 구분선
          300: '#D1D5DB',
          400: '#9CA3AF',  // 비활성 텍스트
          500: '#6B7280',  // 2차 텍스트
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',  // 1차 텍스트
        },
        // Semantic Colors
        background: '#FFFFFF',   // 흰색 배경
        surface: '#FFFFFF',
        error: '#DC2626',        // 하락/부정
        success: '#16A34A',      // 상승/긍정
        info: '#2563EB',         // 정보/링크

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
