'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui'
import { ArrowRight, Trash2, AlertCircle, ShoppingCart } from 'lucide-react'
import { formatPrice, getImageUrl } from '@/lib/utils'
import ImageWithFallback from '@/components/ImageWithFallback'

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart()

  // Rediriger l'admin vers le dashboard
  useEffect(() => {
    if (session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN') {
      router.push('/admin')
    }
  }, [session, router])

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-primary-950">
      <section className="relative min-h-screen overflow-hidden bg-primary-900">
        <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/cart-bg.jpeg')] bg-cover bg-center bg-fixed" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
          {children}
        </div>
      </section>
    </div>
  )

  // Si l'admin essaie d'accéder directement, montrer un message
  if (session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN') {
    return (
      <Wrapper>
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-accent-300 mx-auto mb-2" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-50">
            Accès non disponible
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-accent-100 max-w-xl">
            L&apos;admin ne peut pas acheter des produits. Accédez au dashboard pour gérer la boutique.
          </p>
          <Button
            size="lg"
            className="mt-4 shadow-lg shadow-primary-900/40 sm:px-8"
            onClick={() => router.push('/admin')}
          >
            Aller au dashboard
          </Button>
        </div>
      </Wrapper>
    )
  }

  if (items.length === 0) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center text-center space-y-4 py-10 sm:py-16 md:py-20">
          <ShoppingCart className="w-14 h-14 sm:w-16 sm:h-16 text-accent-300 mb-2" aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-50">
            Votre panier est vide
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-accent-100 max-w-xl">
            Découvrez nos créations artisanales de tricot et crochet, faites main avec amour.
          </p>
          <Link href="/shop">
            <Button
              size="lg"
              className="mt-4 shadow-lg shadow-primary-900/40 sm:px-8"
            >
              Continuer les achats <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </Wrapper>
    )
  }

  const totalPrice = getTotalPrice()

  return (
    <Wrapper>
      <div className="space-y-10">
        <div className="text-center md:text-left">
          <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-3">
            Votre sélection
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-50 mb-3">
            Votre panier
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-accent-100 max-w-2xl">
            Retrouvez ici toutes vos créations coup de cœur avant de finaliser votre commande.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="p-5 sm:p-6 bg-primary-900/70 border border-primary-800 rounded-2xl shadow-lg shadow-primary-900/40"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Image */}
                  <div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 bg-primary-800 rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={item.product?.image ? getImageUrl(item.product.image) : '/images/newsletter.jpg'}
                      alt={item.product?.name || 'Product'}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-accent-200 mb-1">
                        {item.product?.name}
                      </h3>

                      {/* Customizations */}
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="mb-1 text-xs sm:text-sm text-accent-100 space-y-1">
                          {item.customizations.map((custom, idx) => (
                            <p key={idx}>
                              {custom.optionName}: <span className="font-medium">{custom.optionValue}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-xl sm:text-2xl font-bold text-primary-50">
                        {formatPrice((item.product?.price || 0) * item.quantity)}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 border border-accent-300/70 rounded-lg hover:bg-accent-300/10 text-accent-100 text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-primary-50">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 border border-accent-300/70 rounded-lg hover:bg-accent-300/10 text-accent-100 text-sm"
                        >
                          +
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-3 text-red-400 hover:text-red-500 transition-colors"
                          aria-label="Retirer cet article du panier"
                          title="Retirer cet article du panier"
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
            <Card className="p-5 sm:p-6 lg:p-7 sticky top-20 bg-primary-900/80 border border-primary-800 rounded-2xl shadow-lg shadow-primary-900/40 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary-50 mb-2">Résumé</h2>
                <p className="text-sm text-accent-100">
                  Vérifiez votre commande avant de continuer vers le paiement.
                </p>
              </div>

              <div className="space-y-3 pb-5 border-b border-primary-800">
                <div className="flex justify-between text-accent-100 text-sm sm:text-base">
                  <span>Sous-total</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-accent-100 text-sm sm:text-base">
                  <span>Livraison</span>
                  <span className="font-medium">À calculer</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-2xl font-bold text-primary-50">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="space-y-3 pt-2">
                <Link href="/checkout">
                  <Button
                    size="lg"
                    className="w-full shadow-lg shadow-primary-900/40"
                  >
                    Procéder au paiement <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link href="/shop">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-accent-300 text-accent-100 hover:bg-accent-300/10"
                  >
                    Continuer vos achats
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
