'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-primary-950">
      {/* Hero + Pourquoi nous choisir + CTA commande */}
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center" />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-28 space-y-12 sm:space-y-16">
          {/* Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left */}
            <div>
              <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-3">
                Fait main avec amour
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-50 mb-4 sm:mb-6 leading-tight">
                Créations artisanales de{' '}
                <span className="text-accent-300">tricot & crochet</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-accent-100 mb-6 sm:mb-8 leading-relaxed max-w-xl">
                Découvrez nos pièces uniques, tricotées à la main avec des matières nobles. Chaque création
                est pensée pour apporter chaleur, douceur et élégance à votre quotidien.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-start">
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto shadow-lg shadow-primary-900/40 sm:px-8"
                  >
                    Découvrir la boutique <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-accent-300 text-accent-100 hover:bg-accent-300/10 sm:px-8"
                  >
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Image */}
            <div className="flex items-center justify-center mt-6 md:mt-0">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                <div className="absolute -inset-4 rounded-3xl bg-accent-500/20 blur-3xl" />
                <div className="relative rounded-3xl overflow-hidden border border-accent-500/40 bg-primary-900/40 shadow-2xl">
                  <Image
                    src="/images/WhatsApp Image 2026-02-01 at 22.50.19.jpeg"
                    alt="Knit & Craft Logo"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pourquoi nous choisir */}
          <div className="text-center">
            <p className="uppercase tracking-[0.25em] text-accent-300 text-xs sm:text-sm mb-3">
              Pourquoi nous choisir
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-50 mb-8 sm:mb-12 md:mb-14">
              Le détail fait la différence
            </h2>

            <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: 'Créations uniques',
                  description:
                    'Chaque pièce est réalisée à la main, en petite série, pour garantir son caractère unique.',
                },
                {
                  title: 'Qualité premium',
                  description:
                    'Des fils sélectionnés avec soin et un savoir-faire artisanal pour des pièces qui durent.',
                },
                {
                  title: 'Personnalisation',
                  description:
                    'Choisissez vos couleurs, vos tailles et vos matières pour une création qui vous ressemble.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center bg-primary-900/70 border border-primary-800 rounded-2xl p-6 lg:p-7 shadow-lg shadow-primary-900/40"
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-accent-200">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-accent-100">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Mobile / Tablet */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Créations uniques',
                  description:
                    'Chaque pièce est réalisée à la main, en petite série, pour garantir son caractère unique.',
                },
                {
                  title: 'Qualité premium',
                  description:
                    'Des fils sélectionnés avec soin et un savoir-faire artisanal pour des pièces qui durent.',
                },
                {
                  title: 'Personnalisation',
                  description:
                    'Choisissez vos couleurs, vos tailles et vos matières pour une création qui vous ressemble.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center bg-primary-900/70 border border-primary-800 rounded-2xl p-5 shadow-md shadow-primary-900/40"
                >
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-accent-200">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-accent-100">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Prêt à commander ? */}
          <div className="text-center space-y-10">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-primary-50">
                Prêt à commander ?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-accent-50 max-w-2xl mx-auto">
                Parcourez notre collection et trouvez la pièce parfaite. Commande facile et accompagnement
                personnalisé via WhatsApp.
              </p>
              <Link href="/shop">
                <Button
                  size="lg"
                  variant="primary"
                  className="px-8 shadow-lg shadow-primary-900/40"
                >
                  Parcourir la boutique <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* CTA Partagez votre avis */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-primary-50">
                Partagez votre avis
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-accent-50 max-w-2xl mx-auto">
                Vos retours nous aident à faire évoluer nos créations et à imaginer de nouveaux modèles.
              </p>
              <Link href="/reviews">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-50 text-primary-50 hover:bg-primary-50/10 px-8"
                >
                  Laisser un avis <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
