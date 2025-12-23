import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'scrolling-text': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(90%)' },
          '100%': { transform: 'translateX(-90%)' },
        },
      },
      colors: {
        dark: {
          primary: '#161b22',
          secondary: '#ffffff',
        },
        light: {
          primary: '#ffffff',
          secondary: '#161b22',
        },
      },
    },
  },
  plugins: [],
};
export default config;
