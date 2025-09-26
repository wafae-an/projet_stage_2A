import type { Metadata } from 'next'
import '@/styles/global.css'

export const metadata: Metadata = {
  title: 'connexion',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
