'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button, Card } from '@/components/ui'
import { ArrowRight } from 'lucide-react'

interface ExtendedData {
  heroTitle?: string
  heroSubtitle?: string
  storyContent?: string
  founders?: { name?: string; role?: string; description?: string }[]
  values?: { title?: string; description?: string }[]
  teamContent?: string
  backgroundVideo?: string
  backgroundImage?: string
  foundersImage?: string
}

export default function AboutPage() {
  const [ext, setExt] = useState<ExtendedData | null>(null)

  useEffect(() => {
    fetch('/api/about')
      .then((r) => r.json())
      .then((data) => {
        if (data?.extendedData) setExt(data.extendedData)
      })
      .catch(() => {})
  }, [])

  const heroTitle =
    ext?.heroTitle || 'À propos de Knit & Craft'
  const heroSubtitle =
    ext?.heroSubtitle ||
    "Knit & Craft est né d'une passion pour le tricot et le crochet faits main. Chaque pièce est imaginée, créée et finalisée à la main."

  const backgroundVideo =
    ext?.backgroundVideo || '/images/background_apropos.mp4'
  const backgroundImage = ext?.backgroundImage

  const values =
    (ext?.values && ext.values.length >= 3
      ? ext.values
      : [
          {
            title: 'Créations uniques',
            description:
              "Chaque modèle est réalisé en petite série ou en pièce unique, pour que votre tricot soit vraiment à vous.",
          },
          {
            title: 'Qualité & confort',
            description:
              'Nous sélectionnons des fils de qualité, agréables à porter et pensés pour durer au fil des saisons.',
          },
          {
            title: 'Sur-mesure humain',
            description:
              'Nous échangeons avec vous pour adapter les couleurs, les tailles et les matières à votre style et vos envies.',
          },
        ]) as { title?: string; description?: string }[]

  const story =
    ext?.storyContent ||
    "Derrière Knit & Craft, il y a une envie simple : proposer des pièces chaudes, douces et raffinées, loin de la production industrielle.\n\nChaque commande est préparée à la main, du premier point au dernier fil rentré. Vous recevez une création pensée pour vous accompagner longtemps."

  const foundersImage =
    ext?.foundersImage ||
    '/images/WhatsApp Image 2026-02-03 at 15.57.52.jpeg'

  const founders =
    (ext?.founders && ext.founders.length > 0
      ? ext.founders
      : [
          {
            name: 'Fondatrice 1',
            role: 'Co-fondatrice & designer',
            description:
              "Amoureuse des techniques traditionnelles et de l'innovation.",
          },
          {
            name: 'Fondatrice 2',
            role: 'Matières & qualité',
            description:
              'Experte en matières premières et en qualité artisanale.',
          },
          {
            name: 'Fondatrice 3',
            role: 'Vision & durabilité',
            description:
              "Vision créative tournée vers la durabilité et l'authenticité.",
          },
        ]) as { name?: string; role?: string; description?: string }[]

  const teamContent =
    ext?.teamContent ||
    "Knit & Craft est porté par une petite équipe de créatrices passionnées. Ensemble, nous imaginons des pièces qui racontent une histoire et qui sont pensées pour vous accompagner longtemps."

  return (
    <div className="bg-primary-950">
      {/* Même ambiance que la home, mais avec une vidéo dédiée */}
      <section className="relative overflow-hidden bg-primary-900">
        {backgroundImage ? (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-100 mix-blend-multiply"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-100 mix-blend-multiply"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        )}

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-24 space-y-12 sm:space-y-16">
          {/* Hero À propos */}
          <div className="max-w-3xl">
            <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-3">
              L&apos;histoire derrière Knit & Craft
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-50 mb-4 sm:mb-6 leading-tight">
              {heroTitle.split('Knit & Craft')[0]}
              <span className="text-accent-300">
                {heroTitle.includes('Knit & Craft') ? 'Knit & Craft' : ''}
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-accent-100 leading-relaxed max-w-2xl">
              {heroSubtitle}
            </p>
          </div>

          {/* 3 piliers comme la section "Pourquoi nous choisir" */}
          <div className="space-y-8">
            <div className="text-center">
              <p className="uppercase tracking-[0.25em] text-accent-300 text-xs sm:text-sm mb-3">
                Notre philosophie
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-50 mb-6 sm:mb-10">
                Le détail fait la différence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
              {values.slice(0, 3).map((val, idx) => (
                <Card
                  key={idx}
                  className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 lg:p-7 shadow-lg shadow-primary-900/40 text-primary-50"
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-accent-200">
                    {val.title}
                  </h3>
                  <p className="text-sm md:text-base text-accent-100">
                    {val.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Bloc "Notre histoire" + CTA vers la boutique */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Card className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 md:p-8 shadow-lg shadow-primary-900/40 text-primary-50">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Notre histoire</h2>
              <p className="text-sm sm:text-base text-accent-100 leading-relaxed whitespace-pre-line">
                {story}
              </p>
            </Card>

            <div className="flex flex-col items-start md:items-center gap-4">
              <p className="text-sm sm:text-base md:text-lg text-accent-50 max-w-md">
                Envie de découvrir nos pièces ou de commander un modèle personnalisé&nbsp;?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/shop">
                  <Button size="lg" className="shadow-lg shadow-primary-900/40 sm:px-8">
                    Découvrir la boutique <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/bespoke">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-accent-300 text-accent-100 hover:bg-accent-300/10 sm:px-8"
                  >
                    Une pièce sur-mesure <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Nos fondatrices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative w-full max-w-xl mx-auto">
              <div className="absolute -inset-4 rounded-3xl bg-accent-500/20 blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden border border-accent-500/40 bg-primary-900/40 shadow-2xl">
                <Image
                  src={foundersImage}
                  alt="Les fondatrices de Knit & Craft"
                  width={700}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <Card className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 md:p-8 shadow-lg shadow-primary-900/40 text-primary-50">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Nos fondatrices</h2>
              <p className="text-sm sm:text-base text-accent-100 leading-relaxed mb-4">
                Knit &amp; Craft est porté par une petite équipe de créatrices passionnées&nbsp;:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-accent-100">
                {founders.map((f, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-accent-200">
                      {f.name}
                    </span>{' '}
                    {f.role && <>– {f.role}, </>}
                    {f.description ?? (f as { bio?: string }).bio}
                  </li>
                ))}
              </ul>
              <p className="text-sm sm:text-base text-accent-100 leading-relaxed mt-4">
                {teamContent}
              </p>
            </Card>
          </div>

          {/* Section repliable pour accès administrateur */}
          <div className="pt-8 border-t border-primary-800/60 mt-8">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-sm sm:text-base text-accent-200 hover:text-accent-100">
                <span>Espace réservé à l&apos;administration</span>
                <span className="ml-3 text-xs text-accent-300 group-open:hidden">cliquer pour dérouler</span>
                <span className="ml-3 text-xs text-accent-300 hidden group-open:inline">cliquer pour replier</span>
              </summary>
              <div className="mt-4 pl-1 border-l border-primary-800/60">
                <p className="text-xs sm:text-sm text-accent-200 mb-3">
                  Cet espace est réservé à l&apos;administration du site Knit &amp; Craft.
                </p>
                <Link href="/auth/signin">
                  <Button
                    size="sm"
                    className="bg-accent-400 text-primary-950 hover:bg-accent-300 shadow-md shadow-primary-900/40"
                  >
                    Se connecter à l&apos;espace admin
                  </Button>
                </Link>
              </div>
            </details>
          </div>
        </div>
      </section>
    </div>
  )
}
