'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks'
import { Card, Button, Input } from '@/components/ui'
import { Order } from '@/types'
import { formatPrice, formatDateTime, getImageUrl } from '@/lib/utils'
import { Badge } from '@/components/ui'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function AdminOrderDetailPage() {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [variantInfo, setVariantInfo] = useState<{ name: string; daysMin: number; daysMax: number } | null>(null)
  
  const [formData, setFormData] = useState({
    status: '',
    estimatedDays: 0,
  })

  // Chargement de la commande quand l'admin est connecté
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAdmin) {
      fetchOrder()
    }
  }, [isAdmin, orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      const data = await response.json()
      if (data.data) {
        setOrder(data.data)
        setFormData({
          status: data.data.status,
          estimatedDays: data.data.estimatedDays || 0,
        })
        
        // Récupérer les infos du variant
        if (data.data.variantId) {
          fetchVariantInfo(data.data.variantId)
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVariantInfo = async (variantId: string) => {
    try {
      const response = await fetch(`/api/admin/variants/${variantId}`)
      const data = await response.json()
      setVariantInfo(data.data)
    } catch (error) {
      console.error('Error fetching variant:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedDays' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation des jours estimés selon le variant
    if (variantInfo && (formData.estimatedDays < variantInfo.daysMin || formData.estimatedDays > variantInfo.daysMax)) {
      alert(`Les jours doivent être entre ${variantInfo.daysMin} et ${variantInfo.daysMax} jours pour ${variantInfo.name}`)
      return
    }

    setUpdating(true)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.data)
        alert('Commande mise à jour avec succès !')
      } else {
        alert('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setUpdating(false)
    }
  }

  if (isLoading || loading) {
    return <div className="p-8 text-center text-white">Chargement...</div>
  }

  if (!isAdmin) {
    return <div className="p-8 text-center text-red-400">Accès refusé</div>
  }

  if (!order) {
    return <div className="p-8 text-center text-white">Commande non trouvée</div>
  }

  const statusColors: Record<string, string> = {
    PENDING: 'warning',
    CONFIRMED: 'primary',
    PROCESSING: 'primary',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'danger',
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/admin/orders">
          <button className="flex items-center gap-2 text-white/80 hover:text-white mb-8">
            <ArrowLeft className="w-5 h-5" />
            Retour aux commandes
          </button>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Commande {order.orderNumber}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Info */}
            <Card className="p-6 bg-white/20 backdrop-blur-md rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">Informations client</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-white/80">Nom</p>
                  <p className="font-medium text-white">{order.firstName} {order.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-white/80">Email</p>
                  <p className="font-medium text-white">{order.email}</p>
                </div>
                <div>
                  <p className="text-sm text-white/80">Téléphone</p>
                  <p className="font-medium text-white">{order.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-white/80">Adresse</p>
                  <p className="font-medium text-white">
                    {order.address}<br />
                    {order.postalCode} {order.city}<br />
                    {order.country}
                  </p>
                </div>
              </div>
            </Card>

            {/* Order Items / Products */}
            {order.items && order.items.length > 0 && (
              <Card className="p-6 bg-white/20 backdrop-blur-md rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">Produits commandés</h2>
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white/10 rounded-lg">
                      {item.product?.image && (
                        <img src={getImageUrl(item.product.image)} alt="" className="w-12 h-12 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-white">{item.product?.name ?? 'Produit'}</p>
                        <p className="text-sm text-white/70">Qté: {item.quantity} × {formatPrice(item.price)}</p>
                        {item.customizations?.length > 0 && (
                          <p className="text-xs text-white/60 mt-1">
                            {item.customizations.map((c: any) => `${c.optionName}: ${c.optionValue}`).join(', ')}
                          </p>
                        )}
                      </div>
                      <p className="font-medium text-white">{formatPrice((item.price || 0) * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Order Details */}
            <Card className="p-6 bg-white/20 backdrop-blur-md rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">Détails commande</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/80">Date</span>
                  <span className="font-medium text-white">{formatDateTime(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Total</span>
                  <span className="font-medium text-lg text-white">{formatPrice(order.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Type</span>
                  <span className="font-medium text-white">{order.orderType}</span>
                </div>
                {variantInfo && (
                  <div className="flex justify-between pt-3 border-t border-white/20">
                    <span className="text-white/80">Variant</span>
                    <span className="font-medium text-white">{variantInfo.name}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Communication */}
            <Card className="p-6 bg-white/20 backdrop-blur-md rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">Communication</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white">WhatsApp</span>
                  {order.whatsappSent ? (
                    <Badge variant="success">Envoyé</Badge>
                  ) : (
                    <Badge variant="danger">Non envoyé</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white">Email</span>
                  {order.emailSent ? (
                    <Badge variant="success">Envoyé</Badge>
                  ) : (
                    <Badge variant="danger">Non envoyé</Badge>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Edit Sidebar */}
          <div>
            <Card className="p-6 bg-white/20 backdrop-blur-md rounded-lg border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Modifier la commande</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Statut</label>
                  <select
                    name="status"
                    aria-label="Statut de la commande"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-300 [&>option]:bg-gray-800 [&>option]:text-white"
                  >
                    <option value="PENDING" className="bg-gray-800 text-white">En attente</option>
                    <option value="CONFIRMED" className="bg-gray-800 text-white">Confirmée</option>
                    <option value="PROCESSING" className="bg-gray-800 text-white">En cours</option>
                    <option value="SHIPPED" className="bg-gray-800 text-white">Expédiée</option>
                    <option value="DELIVERED" className="bg-gray-800 text-white">Livrée</option>
                    <option value="CANCELLED" className="bg-gray-800 text-white">Annulée</option>
                  </select>
                </div>

                {/* Estimated Days */}
                {variantInfo && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Jours estimés ({variantInfo.name})
                    </label>
                    <p className="text-xs text-white/70 mb-2">
                      Entre {variantInfo.daysMin} et {variantInfo.daysMax} jours
                    </p>
                    <Input
                      type="number"
                      name="estimatedDays"
                      value={formData.estimatedDays}
                      onChange={handleChange}
                      min={variantInfo.daysMin}
                      max={variantInfo.daysMax}
                      className="w-full bg-white/20 border-white/30 text-white"
                    />
                  </div>
                )}

                {/* Current Status */}
                <div className="p-3 bg-white/10 rounded-lg">
                  <p className="text-xs text-white/70 mb-1">Statut actuel</p>
                  <Badge variant={statusColors[order.status] as any}>
                    {order.status}
                  </Badge>
                </div>

                {/* Save Button */}
                <Button
                  type="submit"
                  isLoading={updating}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updating ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
