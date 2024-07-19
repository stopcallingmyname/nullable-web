/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '576px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        LotaGrotesque: ['"LotaGrotesque"', 'serif'],
        IBMPlexMono: ['IBM Plex Mono', 'sans-serif'],
        SourceSerif4: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      colors: {
        black: '#0d0c22',
        bnPink: '#ea64d9',
      },
      textShadow: {
        sm: '0 0 2px var(--tw-shadow-color)',
        DEFAULT: '0 0 4px var(--tw-shadow-color)',
        md: '0 0 10px var(--tw-shadow-color)',
        lg: '0 0 22px var(--tw-shadow-color)',
      },
      animation: {
        'ping-once': 'ping 150ms cubic-bezier(0, 0, 0.2, 1)',
        'scale-once': 'scale 150ms cubic-bezier(0, 0, 0.2, 1)',
        'badge-color-cycle': 'badge-color-cycle 32s linear infinite',
        'horizontal-scroll': 'horizontal-scroll 30s linear infinite',
      },
      keyframes: {
        'badge-color-cycle': {
          '0%': { backgroundColor: '#ffda79' },
          '25%': { backgroundColor: '#ffabe7' },
          '50%': { backgroundColor: '#d2bcf3' },
          '75%': { backgroundColor: '#edf3d8' },
          '100%': { backgroundColor: '#ffda79' },
        },
        'horizontal-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translate3d(calc(-50% - 16px), 0, 0);' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animated'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    }),
  ],
};
