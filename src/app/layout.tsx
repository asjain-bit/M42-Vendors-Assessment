import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vendor Assessment',
  description: 'M42 Vendor Assessment Portal',
  icons: {
    icon: '/white-logo.png',
    shortcut: '/white-logo.png',
    apple: '/white-logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} data-theme="light">
      <head>
        <link rel="icon" href="/white-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/white-logo.png" />
      </head>
      <body className="bg-bg-default text-text-primary antialiased min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
