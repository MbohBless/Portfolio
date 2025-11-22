import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch',
            color: 'inherit',
            a: {
              color: '#000',
              textDecoration: 'underline',
              textDecorationColor: '#d1d5db',
              textUnderlineOffset: '3px',
              transition: 'all 0.2s',
              '&:hover': {
                textDecorationColor: '#000',
              },
            },
            h1: {
              fontWeight: '700',
              letterSpacing: '-0.02em',
            },
            h2: {
              fontWeight: '700',
              letterSpacing: '-0.02em',
            },
            h3: {
              fontWeight: '600',
              letterSpacing: '-0.01em',
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '500',
              color: '#000',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#0a0a0a',
              color: '#fff',
            },
            blockquote: {
              borderLeftColor: '#000',
              fontStyle: 'normal',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
