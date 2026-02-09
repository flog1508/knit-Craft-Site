'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-8 sm:py-12 md:py-20 lg:py-32 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/images/why-choose.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            {/* Left */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                Créations Artisanales de{' '}
                <span className="text-white">Tricot & Crochet</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-6 sm:mb-8 leading-relaxed">
                Découvrez nos créations uniques, faites à la main avec passion. Chaque pièce raconte une histoire.
              </p>
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                <Link href="/shop">
                  <Button size="lg" className="w-full sm:w-auto">
                    Découvrir la boutique <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" className="w-full sm:w-auto" style={{ backgroundColor: '#fbbf24', color: '#1f2937' }}>
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Image */}
            <div className="flex items-center justify-center mt-6 md:mt-0">
              <Image
                src="/images/WhatsApp Image 2026-02-01 at 22.50.19.jpeg"
                alt="Knit & Craft Logo"
                width={400}
                height={400}
                className="object-cover rounded-lg shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section
        className="py-8 sm:py-12 md:py-16 lg:py-24 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/images/why-choose.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-white drop-shadow-lg">
            Pourquoi choisir Knit & Craft ?
          </h2>

          <div className="hidden md:grid grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[
              {
                title: 'Créations Uniques',
                description: 'Chaque pièce est faite à la main avec soin et attention aux détails.',
              },
              {
                title: 'Qualité Premium',
                description: 'Matières nobles et techniques traditionnelles pour durabilité garantie.',
              },
              {
                title: 'Personnalisation',
                description: 'Commandez sur mesure : couleurs, tailles et matières selon vos préférences.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center bg-white/90 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-gray-900">{item.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Mobile Vertical Stack */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                title: 'Créations Uniques',
                description: 'Chaque pièce est faite à la main avec soin et attention aux détails.',
              },
              {
                title: 'Qualité Premium',
                description: 'Matières nobles et techniques traditionnelles pour durabilité garantie.',
              },
              {
                title: 'Personnalisation',
                description: 'Commandez sur mesure : couleurs, tailles et matières selon vos préférences.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center bg-white/90 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-white py-8 sm:py-12 md:py-16 lg:py-20 bg-cover bg-center bg-fixed -mb-4" style={{ backgroundImage: "url('/images/why-choose.jpg')", backgroundPosition: 'center', backgroundSize: 'cover' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 drop-shadow-lg">Prêt à commander ?</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-white drop-shadow-md max-w-2xl mx-auto">
            Parcourez notre collection et trouvez la pièce parfaite. Commande facile, paiement sécurisé par WhatsApp.
          </p>
          <Link href="/shop">
            <Button size="lg" variant="secondary" className="text-white hover:text-gray-100" style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid white' }}>
              Parcourir la boutique <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Reviews CTA Section */}
      <section className="text-white py-8 sm:py-12 md:py-16 lg:py-20 bg-cover bg-center bg-fixed -mb-4" style={{ backgroundImage: "url('/images/why-choose.jpg')", backgroundPosition: 'center', backgroundSize: 'cover' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 drop-shadow-lg">Partagez votre avis</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-white drop-shadow-md max-w-2xl mx-auto">
            Dites-nous ce que vous pensez de nos créations !
          </p>
          <Link href="/reviews">
            <Button size="lg" variant="secondary" className="text-white hover:text-gray-100" style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid white' }}>
              Laisser un avis <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
