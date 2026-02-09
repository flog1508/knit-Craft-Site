'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui'
import { ArrowRight, Trash2, AlertCircle } from 'lucide-react'
import { formatPrice, getImageUrl } from '@/lib/utils'
import ImageWithFallback from '@/components/ImageWithFallback'

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()

  // Rediriger l'admin vers le dashboard
  useEffect(() => {
    if (session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN') {
      router.push('/admin')
    }
  }, [session, router])

  // Si l'admin essaie d'accéder directement, montrer un message
  if (session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN') {
    return (
      <div
        className="min-h-screen py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/cart-bg.jpeg')" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Accès non disponible</h1>
          <p className="text-white/90 mb-8">L&apos;admin ne peut pas acheter des produits</p>
          <Button onClick={() => router.push('/admin')}>Aller au dashboard</Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/cart-bg.jpeg')" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-white mb-4">Votre panier est vide</h1>
            <p className="text-white/90 mb-8">Découvrez nos créations artisanales</p>
            <Link href="/shop">
              <Button size="lg">
                Continuer les achats <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = getTotalPrice()

  return (
    <div
      className="min-h-screen py-12 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/cart-bg.jpeg')" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-12 text-white">Votre Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-6 bg-white/20 backdrop-blur-md border-0">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.product?.image ? getImageUrl(item.product.image) : '/images/newsletter.jpg'}
                      alt={item.product?.name || 'Product'}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.product?.name}
                    </h3>

                    {/* Customizations */}
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="mb-3 text-sm text-white/80">
                        {item.customizations.map((custom, idx) => (
                          <p key={idx}>
                            {custom.optionName}: <span className="font-medium">{custom.optionValue}</span>
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-white">
                        {formatPrice((item.product?.price || 0) * item.quantity)}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 border border-white/40 rounded hover:bg-white/10 text-white"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 border border-white/40 rounded hover:bg-white/10 text-white"
                        >
                          +
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-4 text-red-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div>
            <Card className="p-6 sticky top-20 bg-white/20 backdrop-blur-md border-0">
              <h2 className="text-2xl font-bold text-white mb-6">Résumé</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                <div className="flex justify-between text-white/90">
                  <span>Sous-total</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span>Livraison</span>
                  <span className="font-medium">À calculer</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold text-white mb-6">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full mb-3">
                  Procéder au paiement <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/shop">
                <Button variant="outline" size="lg" className="w-full">
                  Continuer vos achats
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
