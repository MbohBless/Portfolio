import type { Metadata } from 'next'
import './globals.css'
import { ConditionalLayout } from '@/components/ConditionalLayout'

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
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
