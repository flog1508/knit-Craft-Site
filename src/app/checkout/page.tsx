'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/hooks'
import { Button, Input } from '@/components/ui'
import { ArrowLeft, ArrowRight, MessageCircle, Mail, Info } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const inputClass =
  'border-primary-800 bg-primary-900/70 text-primary-50 placeholder:text-accent-100/60 focus:ring-accent-300/20 focus:border-accent-300'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items,
          totalPrice: getTotalPrice(),
          contactMethod,
        }),
      })

      const data = await response.json()

      if (data.success) {
        clearCart()
        if (contactMethod === 'whatsapp' && data.data?.whatsappLink) {
          window.location.href = data.data.whatsappLink
        } else if (contactMethod === 'email') {
          alert('Votre commande a bien été enregistrée. Un email de confirmation vous a été envoyé.')
          router.push('/shop')
        }
      } else {
        alert('Erreur: ' + (data.error || 'Erreur lors de la création de la commande'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de la création de la commande')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <div className="bg-primary-950">
        <section className="relative overflow-hidden bg-primary-900">
          <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/cart-bg.jpeg')] bg-cover bg-center bg-fixed" />
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-28">
            <div className="text-center space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-50">
                Panier vide
              </h1>
              <p className="text-sm sm:text-base text-accent-100 max-w-xl mx-auto">
                Ajoutez des articles à votre panier avant de finaliser votre commande.
              </p>
              <Link href="/shop">
                <Button size="lg" className="shadow-lg shadow-primary-900/40 sm:px-8">
                  <ArrowLeft className="w-5 h-5 mr-2" />
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
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/cart-bg.jpeg')] bg-cover bg-center bg-fixed" />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-28 space-y-12 sm:space-y-16">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-accent-100 hover:text-accent-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au panier
          </Link>

          <div className="text-center">
            <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-3">
              Dernière étape
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-50 mb-4 sm:mb-6 leading-tight">
              Finaliser la <span className="text-accent-300">commande</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-accent-100 max-w-2xl mx-auto leading-relaxed">
              Renseignez vos coordonnées pour que nous puissions vous contacter et confirmer votre commande.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Formulaire */}
            <div className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 lg:p-7 shadow-lg shadow-primary-900/40">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                  <Input
                    label="Nom"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <Input
                  label="Téléphone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <Input
                  label="Adresse"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ville"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                  <Input
                    label="Pays"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="border-t border-primary-800 pt-6">
                  <label className="block text-sm font-medium text-accent-200 mb-3">
                    Comment confirmez-vous votre commande ?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="whatsapp"
                        checked={contactMethod === 'whatsapp'}
                        onChange={(e) => setContactMethod(e.target.value as 'whatsapp' | 'email')}
                        className="w-4 h-4 text-accent-300 focus:ring-accent-300"
                      />
                      <MessageCircle className="w-5 h-5 text-green-400" />
                      <span className="text-accent-100">WhatsApp</span>
                    </label>
                    <label className="flex items-center cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={contactMethod === 'email'}
                        onChange={(e) => setContactMethod(e.target.value as 'whatsapp' | 'email')}
                        className="w-4 h-4 text-accent-300 focus:ring-accent-300"
                      />
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span className="text-accent-100">Email</span>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={loading}
                  className="w-full shadow-lg shadow-primary-900/40"
                >
                  {loading
                    ? 'Traitement...'
                    : contactMethod === 'whatsapp'
                      ? 'Procéder vers WhatsApp'
                      : 'Procéder vers Email'}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
              </form>
            </div>

            {/* Résumé */}
            <div className="lg:sticky lg:top-20 self-start">
              <div className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 lg:p-7 shadow-lg shadow-primary-900/40 space-y-6">
                <h2 className="text-2xl font-bold text-primary-50 mb-2">Résumé commande</h2>

                <div className="space-y-4 pb-5 border-b border-primary-800">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium text-accent-200">{item.product?.name}</p>
                        <p className="text-sm text-accent-100">Qté : {item.quantity}</p>
                      </div>
                      <span className="font-medium text-primary-50">
                        {formatPrice((item.product?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pb-5 border-b border-primary-800">
                  <div className="flex justify-between text-accent-100 text-sm sm:text-base">
                    <span>Sous-total</span>
                    <span className="font-medium text-primary-50">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-accent-100 text-sm sm:text-base">
                    <span>Livraison</span>
                    <span className="font-medium">À confirmer</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-2xl font-bold text-primary-50">
                  <span>Total</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>

                <div className="p-4 bg-primary-800/50 rounded-xl border border-primary-800">
                  <p className="text-sm text-accent-100 flex items-start gap-2">
                    <Info className="w-4 h-4 text-accent-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      Vous serez redirigé vers{' '}
                      {contactMethod === 'whatsapp' ? 'WhatsApp' : 'votre email'} pour finaliser votre
                      commande.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
