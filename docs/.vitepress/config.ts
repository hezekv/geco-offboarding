import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'GECO Asia Design System',
  description: 'UI/UX Style Guide and Component Library for the HR Offboarding Portal',
  base: '/docs/', // Adjust if deploying to a subpath
  themeConfig: {
    logo: '⚡',
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Components', link: '/components/layout-controls' }
    ],
    sidebar: {
      '/guide/': [
        { text: 'Introduction', link: '/guide/introduction' },
        { text: 'Color Styling', link: '/guide/colors' },
        { text: 'Typography', link: '/guide/typography' },
        { text: 'Spacing & Layout', link: '/guide/spacing' }
      ],
      '/components/': [
        { text: 'Shared Layout & Controls', link: '/components/layout-controls' },
        { text: 'Table & List Components', link: '/components/tables-lists' },
        { text: 'Checklist Components', link: '/components/checklists' },
        { text: 'Modal Components', link: '/components/modals' },
        { text: 'Profile Components', link: '/components/profiles' }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hezekv/geco-offboarding' }
    ]
  }
})