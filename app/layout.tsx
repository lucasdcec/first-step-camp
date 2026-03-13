import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { PerfilProvider } from '@/contexts/PerfilContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Primeiro Passo - Assistente de Aprendizado IA',
  description: 'Um assistente de aprendizado IA para crianças de 7 a 12 anos',
  authors: [{ name: 'Primeiro Passo' }],
  viewport: 'width=device-width, initial-scale=1',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎓</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-neutral-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <PerfilProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </PerfilProvider>
      </body>
    </html>
  )
}
