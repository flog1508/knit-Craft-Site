'use client'

import React, { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { Card } from '@/components/ui'
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
      <div className="min-h-screen py-16 bg-cover bg-center" style={{ backgroundImage: "url('/images/why-choose.jpg')" }}>
        <div className="absolute inset-0 bg-black/40 -z-10" />
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Card className="p-8 bg-white/20 backdrop-blur-md rounded-lg border border-white/20">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-2xl font-bold text-white mb-4">Demande reçue !</h1>
            <p className="text-white/90 mb-6">
              Merci pour votre demande de commande sur mesure. Nous vous contacterons très prochainement à l&apos;adresse {formData.email}.
            </p>
            <Link href="/shop">
              <Button className="bg-[#8B4513] hover:bg-[#6B3410] text-white">Retour à la boutique</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 bg-cover bg-center" style={{ backgroundImage: "url('/images/why-choose.jpg')" }}>
      <div className="absolute inset-0 bg-black/40 -z-10" />
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/shop" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8">
          <ArrowLeft className="w-5 h-5" /> Retour à la boutique
        </Link>

        <Card className="p-8 bg-white/20 backdrop-blur-md rounded-lg border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-10 h-10 text-amber-300" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Commande sur mesure</h1>
              <p className="text-white/80 text-sm">Des créations uniques, pensées rien que pour vous</p>
            </div>
          </div>

          <p className="text-white/90 mb-6">
            Vous avez une idée précise, un projet personnalisé ou une commande ultra-spécifique ? Décrivez-nous votre vision et nous vous recontacterons pour en discuter.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Votre email *</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="vous@email.com"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Description de votre projet *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Décrivez ce que vous souhaitez : type de création, style, couleurs..."
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Exigences particulières</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={3}
                placeholder="Taille, matière, délai souhaité..."
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Budget indicatif (€)</label>
                <Input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Optionnel"
                  min="0"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Date souhaitée</label>
                <Input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-white"
            >
              Envoyer ma demande
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
