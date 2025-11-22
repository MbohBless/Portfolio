import type { Metadata } from 'next'
import './globals.css'
import { ConditionalLayout } from '@/components/ConditionalLayout'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Portfolio - AI Engineer & Software Developer',
  description: 'AI Engineer and Software Developer specializing in machine learning, artificial intelligence, and scalable software solutions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
