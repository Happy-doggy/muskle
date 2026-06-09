/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ── ShadCN CSS variable tokens ──────────────────
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        // ── Couleurs Muskle ─────────────────────────
        mint:        'var(--mint)',
        'mint-strong': 'var(--mint-strong)',
        ink:         'var(--ink)',
        cream:       'var(--cream)',
        paper:       'var(--paper)',
        'paper-warm': 'var(--paper-warm)',
        stroke:      'var(--stroke)',
        'ring-track': 'var(--ring-track)',
        // ── Catégories d'exercices ──────────────────
        musculation:  'var(--cat-musculation)',
        renforcement: 'var(--cat-renforcement)',
        yoga:         'var(--cat-yoga)',
        kine:         'var(--cat-kine)',
        cardio:       'var(--cat-cardio)',
        mobilite:     'var(--cat-mobilite)',
        autre:        'var(--cat-autre)',
        // ── Phases du player ────────────────────────
        'phase-prepare': 'var(--phase-prepare)',
        'phase-work':    'var(--phase-work)',
        'phase-rest':    'var(--phase-rest)',
        'phase-done':    'var(--phase-done)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        sans:    ['"Host Grotesk"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'slide-up': {
          from: { transform: 'translateY(12px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'timer-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'slide-up':       'slide-up 0.3s ease-out',
        'fade-in':        'fade-in 0.2s ease-out',
        'timer-pulse':    'timer-pulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
