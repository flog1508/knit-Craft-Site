'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CheckoutProps {
  productId?: string
}

export default function CheckoutForm({ productId }: CheckoutProps) {
  const [orderType, setOrderType] = useState<'EXACT' | 'CUSTOM' | 'BESPOKE'>('EXACT')
  const [variantId, setVariantId] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Maroc',
  })
  const [sendVia, setSendVia] = useState<'whatsapp' | 'email'>('whatsapp')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (orderType === 'BESPOKE') {
        // Demande sur mesure
        const res = await fetch('/api/bespoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            description: 'Demande de produit sur mesure',
            requirements: `Prénom: ${formData.firstName}, Nom: ${formData.lastName}`,
          }),
        })
        
        if (res.ok) {
          setSuccess(true)
          alert('✅ Demande reçue ! Nous vous contacterons bientôt.')
        } else {
          throw new Error('Erreur lors de l\'envoi de la demande')
        }
      } else {
        // Commande standard
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            items: productId ? [{ productId, quantity: 1 }] : [],
            orderType,
            variantId: variantId || undefined,
            sendVia,
          }),
        })

        const data = await res.json()

        if (res.ok) {
          if (sendVia === 'whatsapp' && data.whatsappLink) {
            // Afficher le lien WhatsApp
            setWhatsappLink(data.whatsappLink)
            setSuccess(true)
          } else {
            alert('✅ ' + data.message)
            setSuccess(true)
          }
        } else {
          throw new Error(data.error || 'Erreur lors du traitement')
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue'
      setError(message)
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  // Afficher le lien WhatsApp
  if (success && whatsappLink) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">✅ Commande créée !</h2>
          <p className="text-gray-600 mb-6">
            Cliquez sur le bouton ci-dessous pour confirmer via WhatsApp
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 inline-block"
          >
            💬 Ouvrir WhatsApp
          </a>
          <button
            onClick={() => {
              setSuccess(false)
              setWhatsappLink(null)
            }}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            Fermer
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {/* Sélection du type de commande */}
      <div>
        <h3 className="text-lg font-bold mb-4">Type de commande</h3>
        <div className="space-y-3">
          {[
            {
              value: 'EXACT',
              label: 'Produit Exact',
              desc: 'Le produit exactement comme sur la photo',
            },
            {
              value: 'CUSTOM',
              label: 'Personnalisé',
              desc: 'Choisir couleur, taille, etc.',
            },
            {
              value: 'BESPOKE',
              label: 'Sur Mesure',
              desc: 'Produit entièrement personnalisé',
            },
          ].map(option => (
            <label
              key={option.value}
              className={`flex items-center p-4 border-2 rounded cursor-pointer transition ${
                orderType === option.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                checked={orderType === option.value}
                onChange={(e) => setOrderType(e.target.value as any)}
                className="mr-3"
              />
              <div>
                <p className="font-bold">{option.label}</p>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Infos client */}
      <div>
        <h3 className="text-lg font-bold mb-4">Informations personnelles</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            value={formData.firstName}
            onChange={handleInputChange}
            className="px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={formData.lastName}
            onChange={handleInputChange}
            className="px-4 py-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="px-4 py-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Téléphone (+212...)"
            value={formData.phone}
            onChange={handleInputChange}
            className="px-4 py-2 border rounded"
            required
          />
        </div>
      </div>

      {/* Adresse (si pas sur mesure) */}
      {orderType !== 'BESPOKE' && (
        <div>
          <h3 className="text-lg font-bold mb-4">Adresse de livraison</h3>
          <input
            type="text"
            name="address"
            placeholder="Adresse"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded mb-4"
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              placeholder="Ville"
              value={formData.city}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded"
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Code postal"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded"
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Pays"
              value={formData.country}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded"
              required
            />
          </div>
        </div>
      )}

      {/* Délai de livraison (si pas sur mesure) */}
      {orderType !== 'BESPOKE' && (
        <div>
          <label className="block text-sm font-medium mb-2">Délai de livraison</label>
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Sélectionner un délai...</option>
            <option value="normal">⏱️ Normal - 7-10 jours (1.0x prix)</option>
            <option value="express">🚀 Express - 3-5 jours (1.5x prix)</option>
            <option value="premium">⚡ Premium - 1-3 jours (2.0x prix)</option>
          </select>
        </div>
      )}

      {/* Mode de notification */}
      {orderType !== 'BESPOKE' && (
        <div>
          <label className="block text-sm font-medium mb-2">Mode de notification</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="whatsapp"
                checked={sendVia === 'whatsapp'}
                onChange={(e) => setSendVia(e.target.value as any)}
                className="mr-2"
              />
              <span>💬 WhatsApp</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="email"
                checked={sendVia === 'email'}
                onChange={(e) => setSendVia(e.target.value as any)}
                className="mr-2"
              />
              <span>📧 Email</span>
            </label>
          </div>
        </div>
      )}

      {/* Messages d'erreur */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      {/* Bouton submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '⏳ Traitement...' : '✓ Valider la commande'}
      </button>
    </form>
  )
}
