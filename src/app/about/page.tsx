'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui'

interface Founder {
  name: string
  role: string
  description: string
  image?: string
}

interface Value {
  title: string
  description: string
}

interface ExtendedData {
  heroTitle?: string
  heroSubtitle?: string
  storyContent?: string
  founders?: Founder[]
  values?: Value[]
  teamContent?: string
  backgroundVideo?: string
  backgroundImage?: string
  foundersImage?: string
}

const defaultFounders: Founder[] = [
  { name: 'Fondatrice 1', role: 'Co-fondatrice & Designer', description: "Passionnée par les techniques traditionnelles et l'innovation." },
  { name: 'Fondatrice 2', role: 'Co-fondatrice & Créatrice', description: 'Experte en matières premières et qualité artisanale.' },
  { name: 'Fondatrice 3', role: 'Co-fondatrice & Vision', description: "Visionnaire pour la durabilité et l'authenticité." },
]

const defaultValues: Value[] = [
  { title: 'Qualité', description: 'Nous utilisons uniquement des matières premières sélectionnées pour leur qualité.' },
  { title: 'Authenticité', description: 'Chaque pièce est créée à la main avec passion et attention aux détails.' },
  { title: 'Durabilité', description: 'Nous croyons en la création de pièces intemporelles et durables.' },
]

export default function AboutPage() {
  const [about, setAbout] = useState<ExtendedData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/about')
      .then(r => r.json())
      .then(data => {
        if (data?.extendedData) setAbout(data.extendedData)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const ext = about || {}
  const heroTitle = ext.heroTitle || 'À Propos de Knit & Craft'
  const heroSubtitle = ext.heroSubtitle || "Découvrez l'histoire derrière nos créations artisanales"
  const storyContent = ext.storyContent || "Knit & Craft est née d'une passion pour l'art du tricot et du crochet. Depuis plus de 10 ans, nous créons des pièces uniques en utilisant des techniques traditionnelles et des matières premières de qualité.\n\nChaque création est le fruit d'un travail minutieux, alliant créativité, compétence et amour du détail. Nous croyons que le fait main a une valeur inestimable."
  const founders = (ext.founders && ext.founders.length > 0) ? ext.founders : defaultFounders
  const values = (ext.values && ext.values.length > 0) ? ext.values : defaultValues
  const teamContent = ext.teamContent || "Notre équipe est composée d'artisans passionnés et expérimentés. Nous travaillons ensemble pour créer des pièces qui vous toucheront et dureront dans le temps."
  const backgroundVideo = ext.backgroundVideo || '/images/WhatsApp Video 2026-02-03 at 14.39.33.mp4'
  const backgroundImage = ext.backgroundImage
  const foundersImage = ext.foundersImage || '/images/WhatsApp Image 2026-02-03 at 15.57.52.jpeg'

  return (
    <div className="relative min-h-screen bg-primary-950">
      {/* Video/Image Background */}
      {backgroundVideo && !backgroundImage && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-100 mix-blend-multiply"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      {backgroundImage && (
        <div
          className="absolute top-0 left-0 w-full h-full -z-10 bg-cover bg-center opacity-100 mix-blend-multiply"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      {!backgroundVideo && !backgroundImage && (
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-primary-900" />
      )}
      <div className="absolute inset-0 bg-primary-900/80 -z-0" />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-50 mb-3 sm:mb-4 md:mb-6 drop-shadow-lg">
            {heroTitle}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-accent-100 drop-shadow-md">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <Card className="mb-8 sm:mb-10 md:mb-12 p-4 sm:p-6 md:p-8 bg-primary-900/70 backdrop-blur-md border border-primary-800 shadow-lg text-primary-50">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              Notre Histoire
            </h2>
            <div className="text-accent-100 leading-relaxed whitespace-pre-line">{storyContent}</div>
          </Card>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-4 sm:p-6 bg-primary-900/70 backdrop-blur-md border border-primary-800 shadow-lg text-primary-50"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-accent-200">{value.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-accent-100">{value.description}</p>
              </Card>
            ))}
          </div>

          {/* Founders */}
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-50 mb-6 sm:mb-8 text-center drop-shadow-lg">
              Nos Fondatrices
            </h2>
            <Card className="mb-8 sm:mb-12 bg-primary-900/70 backdrop-blur-md border border-primary-800 shadow-lg overflow-hidden text-primary-50">
              <img src={foundersImage} alt="Nos Fondatrices" className="w-full h-auto object-cover" />
              <div className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {founders.map((founder, index) => (
                    <div key={index} className="text-center">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">
                        {founder.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-accent-100 mb-2">{founder.role}</p>
                      <p className="text-accent-100 text-xs sm:text-sm">
                        {(founder as any).description ?? (founder as any).bio ?? ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Team */}
          <Card className="p-4 sm:p-6 md:p-8 bg-primary-900/70 backdrop-blur-md border border-primary-800 shadow-lg text-primary-50">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Notre Équipe</h2>
            <p className="text-xs sm:text-sm md:text-base text-accent-100 leading-relaxed whitespace-pre-line">
              {teamContent}
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
