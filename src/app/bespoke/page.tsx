'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Mail, FileText, ListChecks, Wallet, Calendar } from 'lucide-react'

const inputClass =
  'border-primary-800 bg-primary-900/70 text-primary-50 placeholder:text-accent-100/50 focus:ring-accent-300/20 focus:border-accent-300 rounded-lg'

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
        <section className="relative overflow-hidden bg-primary-900 min-h-screen flex items-center">
          <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center bg-fixed" />
          <div className="relative max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="bg-primary-900/70 border border-primary-800 rounded-2xl p-8 sm:p-10 shadow-lg shadow-primary-900/40">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-400/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent-300" aria-hidden="true" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-50 mb-3">Demande reçue !</h1>
              <p className="text-accent-100 mb-6 leading-relaxed">
                Merci pour votre confiance. Nous étudions votre projet et vous recontacterons très prochainement à
                <span className="font-medium text-primary-50"> {formData.email}</span>.
              </p>
              <Link href="/shop">
                <Button className="shadow-lg shadow-primary-900/40" variant="primary">
                  Retour à la boutique
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-primary-950">
      {/* Même style que la page d'accueil, avec le même background (sans overlay supplémentaire) */}
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center bg-fixed" />

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

          {/* Formulaire personnalisé */}
          <div className="max-w-4xl">
            <div className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg shadow-primary-900/40">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-accent-300" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary-50 mb-1">
                    Parlez-nous de votre projet
                  </h2>
                  <p className="text-accent-100 text-sm sm:text-base">
                    Décrivez votre idée en quelques mots. Nous vous recontactons sous 48 h avec une proposition.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-accent-200 mb-2">
                    <Mail className="w-4 h-4" /> Votre email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="vous@email.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-accent-200 mb-2">
                    <FileText className="w-4 h-4" /> Description de votre projet *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Type de pièce (pull, gilet, accessoire…), style, couleurs, ambiance souhaitée…"
                    className={`w-full px-4 py-3 ${inputClass} resize-y min-h-[100px]`}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-accent-200 mb-2">
                    <ListChecks className="w-4 h-4" /> Exigences particulières
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Taille, matière préférée, délai souhaité…"
                    className={`w-full px-4 py-3 ${inputClass} resize-y`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-accent-200 mb-2">
                      <Wallet className="w-4 h-4" /> Budget indicatif (FC)
                    </label>
                    <Input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Optionnel"
                      min="0"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-accent-200 mb-2">
                      <Calendar className="w-4 h-4" /> Date souhaitée
                    </label>
                    <Input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    isLoading={loading}
                    className="w-full shadow-lg shadow-primary-900/40"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Envoyer ma demande
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
