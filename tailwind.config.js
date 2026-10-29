/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        brand: {
          DEFAULT: 'var(--c-brand)',
          dk: 'var(--c-brand-dk)',
          soft: 'var(--c-brand-soft)',
        },
        accent: 'var(--c-accent)',
        ink: {
          DEFAULT: 'var(--c-ink)',
          2: 'var(--c-ink-2)',
          3: 'var(--c-ink-3)',
          4: 'var(--c-ink-4)',
        },
        surface: {
          DEFAULT: 'var(--c-surface)',
          2: 'var(--c-surface-2)',
        },
        sidebar: {
          DEFAULT: 'var(--c-sidebar)',
          text: 'var(--c-sidebar-text)',
          muted: 'var(--c-sidebar-muted)',
          hover: 'var(--c-sidebar-hover)',
          active: 'var(--c-sidebar-active)',
        },
        status: {
          success: 'var(--c-success)',
          warning: 'var(--c-warning)',
          danger: 'var(--c-danger)',
          'danger-soft': 'var(--c-danger-soft)',
          draft: 'var(--c-draft-bg)',
          'draft-ink': 'var(--c-draft-ink)',
        },
        border: {
          DEFAULT: 'var(--c-border)',
          input: 'var(--c-border-input)',
          line: 'var(--c-line)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        card: 'var(--radius-card)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}