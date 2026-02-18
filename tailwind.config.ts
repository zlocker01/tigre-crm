const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        xs: '480px',
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },
      spacing: {
        '8': '2rem', // Añadimos explícitamente el spacing-8
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--secondary) / 0.12) 100%)',
        'dark-gold-gradient':
          'linear-gradient(135deg, hsl(var(--primary) / 0.4) 0%, hsl(var(--secondary) / 0.15) 100%)',
      },
      colors: {
        primaryColor: 'hsl(var(--primary))',
        secondaryColor: 'hsl(var(--secondary))',
        primaryText: 'hsl(var(--foreground))',
        secondaryText: 'hsl(var(--muted-foreground))',
        accentColor: 'hsl(var(--accent))',

        // Mapeo de compatibilidad
        gold: 'hsl(var(--primary))',
        goldAccent: 'hsl(var(--secondary))',
        silver: 'hsl(var(--muted))',
        bronze: 'hsl(var(--muted-foreground))',
        goldHover: 'hsl(var(--primary) / 0.9)',
        silverHover: 'hsl(var(--muted) / 0.9)',
        bronzeHover: 'hsl(var(--muted-foreground) / 0.9)',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
};

module.exports = config;
