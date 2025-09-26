import type { Metadata } from 'next'
import '@/styles/global.css'


export const metadata: Metadata = {
  title: 'mon application',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

