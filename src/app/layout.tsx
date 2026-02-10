import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Knit & Craft - Tricot et Crochet Fait Main',
  description:
    'Découvrez nos créations artisanales de tricot et crochet. Produits personnalisés, sur mesure et commande WhatsApp.',
  keywords: ['tricot', 'crochet', 'handmade', 'artisanal', 'fait main'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-transparent text-gray-900">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
