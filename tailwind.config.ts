import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['DM Mono', 'monospace'],
        serif: ['Fraunces', 'serif'],
      },
      colors: {
        ink: '#1a1a2e',
        paper: '#f4f1eb',
        cream: '#ede9df',
        accent: { DEFAULT: '#c8472b', hover: '#a83825' },
        muted: '#7a7468',
        success: '#2d6a4f',
      }
    }
  },
  plugins: [],
}

export default config
