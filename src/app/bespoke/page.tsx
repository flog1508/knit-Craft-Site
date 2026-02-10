'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button, Input, Card } from '@/components/ui'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function BespokeOrderPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    description: '',
    requirements: '',
    budget: '',
    deadline: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/bespoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          description: formData.description,
          requirements: formData.requirements,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          deadline: formData.deadline || undefined,
        }),
      })
      const data = await res.json()
      if (data.success || !data.error) {
        setSent(true)
      } else {
        alert('Erreur: ' + (data.error || 'Impossible d\'envoyer la demande'))
      }
    } catch (error) {
      console.error(error)
      alert('Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-primary-950">
        <section className="relative overflow-hidden bg-primary-900">
          <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <Card className="p-8 bg-primary-900/70 backdrop-blur-md rounded-2xl border border-primary-800 text-primary-50 shadow-lg shadow-primary-900/40">
              <Sparkles className="w-14 h-14 mx-auto mb-4 text-accent-300" aria-hidden="true" />
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Demande reçue !</h1>
              <p className="text-accent-100 mb-6">
                Merci pour votre demande de commande sur mesure. Nous vous contacterons très prochainement à
                l&apos;adresse {formData.email}.
              </p>
              <Link href="/shop">
                <Button variant="primary">Retour à la boutique</Button>
              </Link>
            </Card>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-primary-950">
      {/* Même style que la page d'accueil, avec le même background (sans overlay supplémentaire) */}
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center" />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-24 space-y-10 sm:space-y-12">
          {/* Hero 2 colonnes comme la home */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Texte */}
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-accent-100 hover:text-accent-300 text-sm mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Retour à la boutique
              </Link>
              <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-3">
                Créez votre pièce unique
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-50 mb-4 sm:mb-6 leading-tight">
                Commande <span className="text-accent-300">sur mesure</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-accent-100 leading-relaxed max-w-xl">
                Vous avez une idée précise, un modèle en tête ou une envie très particulière&nbsp;? Racontez-nous
                votre projet et nous vous proposerons une création entièrement personnalisée.
              </p>
            </div>

            {/* Visuel comme sur la home */}
            <div className="flex items-center justify-center mt-6 md:mt-0">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                <div className="absolute -inset-4 rounded-3xl bg-accent-500/20 blur-3xl" />
                <div className="relative rounded-3xl overflow-hidden border border-accent-500/40 bg-primary-900/40 shadow-2xl">
                  <Image
                    src="/images/founders-2.jpeg"
                    alt="Exemple de création sur mesure Knit & Craft"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire dans un card stylé */}
          <div className="max-w-4xl">
            <Card className="p-6 sm:p-8 bg-primary-900/70 backdrop-blur-md rounded-2xl border border-primary-800 text-primary-50 shadow-lg shadow-primary-900/40">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-accent-300" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Parlez-nous de votre projet</h2>
                  <p className="text-accent-100 text-sm">
                    Quelques détails suffisent, nous reviendrons vers vous avec des propositions.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary-50 mb-2">
                    Votre email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="vous@email.com"
                    className="bg-transparent border-primary-700 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-50 mb-2">
                    Description de votre projet *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Décrivez ce que vous souhaitez : type de création, style, couleurs..."
                    className="w-full px-4 py-2 bg-transparent border border-primary-700 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-accent-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-50 mb-2">
                    Exigences particulières
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Taille, matière, délai souhaité..."
                    className="w-full px-4 py-2 bg-transparent border border-primary-700 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-accent-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-50 mb-2">
                      Budget indicatif (€)
                    </label>
                    <Input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Optionnel"
                      min="0"
                      className="bg-transparent border-primary-700 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-50 mb-2">
                      Date souhaitée
                    </label>
                    <Input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="bg-transparent border-primary-700 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
                <Button type="submit" isLoading={loading} className="w-full" variant="primary">
                  Envoyer ma demande
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
