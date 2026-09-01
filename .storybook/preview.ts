import type { Preview } from '@storybook/react'
import React from 'react'
import { ThemeProvider } from '../src/contexts/ThemeContext'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      React.createElement(ThemeProvider, { defaultTheme: 'light' },
        React.createElement('div', { className: 'p-6 bg-bg-default text-text-primary min-h-screen' },
          React.createElement(Story, null)
        )
      )
    ),
  ],
}

export default preview
