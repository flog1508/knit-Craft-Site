'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/hooks'
import { Button, Input } from '@/components/ui'
import { Card } from '@/components/ui'
import { ArrowLeft, ArrowRight, MessageCircle, Mail, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

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

  // Rediriger l'admin vers le dashboard
  useEffect(() => {
    if (session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN') {
      router.push('/admin')
    }
  }, [session, router])

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
        // Rediriger vers WhatsApp ou Email
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
      <div
        className="min-h-screen py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/cart-bg.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/30 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Panier vide</h1>
          <Link href="/shop">
            <Button size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour à la boutique
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Si l'admin essaie d'accéder directement, montrer un message
  if (session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN') {
    return (
      <div
        className="min-h-screen py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/cart-bg.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/30 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Accès non disponible</h1>
          <p className="text-white/90 mb-8">L&apos;admin ne peut pas acheter des produits</p>
          <Button onClick={() => router.push('/admin')}>Aller au dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-12 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/cart-bg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-8">
          <ArrowLeft className="w-5 h-5" />
          Retour au panier
        </Link>

        <h1 className="text-4xl font-bold mb-12 text-white">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <Card className="p-8 bg-white/15 backdrop-blur-xl border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="text-white bg-white/15 border-white/30 placeholder:text-white/50 focus:ring-white/40 focus:border-white/50"
                  />
                  <Input
                    label="Nom"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="text-white bg-white/15 border-white/30 placeholder:text-white/50 focus:ring-white/40 focus:border-white/50"
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="text-white bg-white/15 border-white/30 placeholder:text-white/50 focus:ring-white/40 focus:border-white/50"
                />

                <Input
                  label="Téléphone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="text-white bg-white/15 border-white/30 placeholder:text-white/50 focus:ring-white/40 focus:border-white/50"
                />

                <Input
                  label="Adresse"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="text-white bg-white/15 border-white/30 placeholder:text-white/50 focus:ring-white/40 focus:border-white/50"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ville"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="text-white bg-white/15 border-white/30 placeholder:text-white/50 focus:ring-white/40 focus:border-white/50"
                  />
                  <Input
                    label="Pays"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="text-white bg-white/15 border-white/30 placeholder:text-white/50 focus:ring-white/40 focus:border-white/50"
                  />
                </div>

                <div className="border-t-2 border-white/20 pt-6">
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Comment confirmez-vous votre commande ?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="whatsapp"
                        checked={contactMethod === 'whatsapp'}
                        onChange={(e) => setContactMethod(e.target.value as 'whatsapp' | 'email')}
                        className="w-4 h-4"
                      />
                      <MessageCircle className="w-5 h-5 ml-2 text-green-400" />
                      <span className="ml-2 text-white/90">WhatsApp</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={contactMethod === 'email'}
                        onChange={(e) => setContactMethod(e.target.value as 'whatsapp' | 'email')}
                        className="w-4 h-4"
                      />
                      <Mail className="w-5 h-5 ml-2 text-blue-400" />
                      <span className="ml-2 text-white/90">Email</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" size="lg" isLoading={loading} className="w-full">
                  {loading ? 'Traitement...' : contactMethod === 'whatsapp' ? 'Procéder vers WhatsApp' : 'Procéder vers Email'}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </Button>
              </form>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="p-8 sticky top-20 bg-white/15 backdrop-blur-xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Résumé commande</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-white/20">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium text-white">{item.product?.name}</p>
                      <p className="text-sm text-white/60">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-white/90">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white/70">
                  <span>Sous-total</span>
                  <span className="font-medium text-white/90">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Livraison</span>
                  <span className="font-medium text-white/90">À confirmer</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold text-white pt-6 border-t border-white/20">
                <span>Total</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>

              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                <p className="text-sm text-white/90 flex items-center gap-2">
                  <Info className="w-4 h-4 text-white/90" aria-hidden="true" />
                  <span>
                    Vous serez redirigé vers {contactMethod === 'whatsapp' ? 'WhatsApp' : 'votre email'} pour finaliser votre commande.
                  </span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
