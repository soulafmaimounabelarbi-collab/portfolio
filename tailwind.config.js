/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream:     '#FFF8F8',
        blush:     '#FFF0F3',
        petal:     '#FFE4EC',
        roseMist:  '#F5C6D6',
        roseSoft:  '#E8A0BA',
        rose:      '#D4789A',
        roseDeep:  '#B85A7A',
        charcoal:  '#2D2D2D',
        slate:     '#4A4A4A',
        ash:       '#787878',
        mist:      '#AAAAAA',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'Menlo', 'monospace'],
      },
      fontSize: { '2xs': ['0.62rem', { lineHeight: '1rem' }] },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        silk:   'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      transitionDuration: { '400': '400ms', '600': '600ms', '800': '800ms' },
    },
  },
  plugins: [],
}
