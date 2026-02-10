'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui'

interface Review {
  id: string
  name: string
  message: string
}

export default function ReviewsPage() {
  const initialStaticReviews: Review[] = [
    {
      id: 'static-1',
      name: 'Sabrina',
      message:
        'Magnifiques créations, très soignées, et un accompagnement au top pour choisir les bonnes couleurs.',
    },
    {
      id: 'static-2',
      name: 'Amélie',
      message:
        'J’ai commandé un ensemble naissance sur mesure, le résultat est encore plus beau que sur les photos.',
    },
    {
      id: 'static-3',
      name: 'Karim',
      message: 'Livraison rapide, travail très propre, on sent vraiment le fait main avec amour.',
    },
  ]

  const [reviews, setReviews] = useState<Review[]>(initialStaticReviews)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews')
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data.data) && data.data.length > 0) {
          const dynamicReviews: Review[] = data.data.map((r: any) => ({
            id: r.id || `${r.createdAt || ''}`,
            name: r.name || 'Client Knit & Craft',
            message: r.message,
          }))
          setReviews([...dynamicReviews, ...initialStaticReviews])
        }
      } catch {
        // On garde au moins les avis statiques
      }
    }

    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitted(false)
    setError(null)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de l’envoi de votre avis')
      }

      const newReview: Review = {
        id: data.data?.id || `local-${Date.now()}`,
        name: data.data?.name || formData.name || 'Client Knit & Craft',
        message: data.data?.message || formData.message,
      }

      setReviews(prev => [newReview, ...prev])
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-primary-950">
      <section className="relative min-h-screen overflow-hidden bg-primary-900">
        <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center bg-fixed" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-3">
              Vos mots, notre fierté
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-50 mb-4">
              Avis & retours de nos clientes
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-accent-100">
              Découvrez ce que nos clientes pensent de leurs créations tricot & crochet, toutes réalisées à la
              main avec soin.
            </p>
          </div>

          {/* Liste des avis (d’abord ceux du blob, puis les exemples) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 shadow-lg shadow-primary-900/40 flex flex-col justify-between"
              >
                <p className="text-sm sm:text-base text-accent-50 mb-4 leading-relaxed">
                  “{review.message}”
                </p>
                <p className="text-sm font-semibold text-accent-200">— {review.name}</p>
              </div>
            ))}
          </div>

          {/* Formulaire laisser un avis avec blob */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-50">
                Envie de partager votre expérience ?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-accent-100 max-w-2xl mx-auto mt-3">
                Laissez votre avis directement ici. Cela nous aide à améliorer nos créations et à rassurer les
                futurs clients.
              </p>
            </div>

            <div className="relative">
              {/* Blob de fond */}
              <div
                className="pointer-events-none absolute -inset-4 sm:-inset-6 rounded-3xl bg-accent-500/25 blur-3xl opacity-70"
                aria-hidden="true"
              />

              <div className="relative bg-primary-900/85 border border-primary-800 rounded-2xl p-6 sm:p-8 shadow-lg shadow-primary-900/40">
                {submitted && (
                  <div className="mb-4 rounded-lg border border-green-500/60 bg-green-500/10 px-4 py-3 text-sm text-green-100">
                    Merci pour votre avis, il a bien été pris en compte.
                  </div>
                )}

                {error && (
                  <div className="mb-4 rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs sm:text-sm font-medium text-primary-50 mb-2"
                      >
                        Votre prénom ou nom
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex : Sarah"
                        className="w-full rounded-lg border border-primary-700 bg-primary-900/70 px-3 py-2 text-sm sm:text-base text-primary-50 placeholder:text-accent-100/50 focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-400"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs sm:text-sm font-medium text-primary-50 mb-2"
                      >
                        Votre email (non affiché)
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="vous@email.com"
                        className="w-full rounded-lg border border-primary-700 bg-primary-900/70 px-3 py-2 text-sm sm:text-base text-primary-50 placeholder:text-accent-100/50 focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs sm:text-sm font-medium text-primary-50 mb-2"
                    >
                      Votre avis
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Parlez de votre expérience, de la qualité, du délai, de ce que vous avez aimé..."
                      className="w-full rounded-lg border border-primary-700 bg-primary-900/70 px-3 py-2 text-sm sm:text-base text-primary-50 placeholder:text-accent-100/50 focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-400"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={submitting}
                      className="px-8 shadow-lg shadow-primary-900/40"
                    >
                      Envoyer mon avis
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
