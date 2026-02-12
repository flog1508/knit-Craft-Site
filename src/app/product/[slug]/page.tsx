'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Product, CustomOption } from '@/types'
import { Badge, Button, Card } from '@/components/ui'
import { useCart } from '@/hooks'
import { formatPrice, calculateDiscountedPrice, getImageUrl } from '@/lib/utils'
import ImageWithFallback from '@/components/ImageWithFallback'
import { ShoppingCart, Star } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewsCount, setReviewsCount] = useState<number | null>(null)
  const [customizations, setCustomizations] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [variants, setVariants] = useState<any[]>([])

  // Chargement du produit pour le slug courant
  useEffect(() => {
    fetchProduct()
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${slug}`)
      const data = await response.json()
      if (data.success) {
        setProduct(data.data)
        // Fetch variants for this product
        const variantsRes = await fetch(`/api/admin/products/${data.data.id}/variants`)
        const variantsData = await variantsRes.json()
        if (variantsData.success) {
          setVariants(variantsData.data || [])
          // Set first variant as default
          if (variantsData.data && variantsData.data.length > 0) {
            setSelectedVariantId(variantsData.data[0].id)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchCount = async () => {
      if (!product?.id) return
      try {
        const res = await fetch(`/api/reviews/count?productId=${product.id}`)
        const d = await res.json()
        if (d.success) setReviewsCount(d.data.count || 0)
      } catch (err) {
        console.error('Error fetching reviews count', err)
      }
    }

    fetchCount()
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <p className="text-gray-600 mb-6">Produit non trouvé</p>
          <Link href="/shop">
            <Button>Retour à la boutique</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage)

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${Math.random()}`,
      cartId: 'temp',
      productId: product.id,
      quantity,
      customizations: Object.entries(customizations).map(([key, value]) => ({
        id: key,
        cartItemId: 'temp',
        optionName: key,
        optionValue: value,
      })),
      product,
    })
  }

  return (
    <div
      className="min-h-screen py-12 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/cart-bg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-white/80">
          <Link href="/" className="hover:text-white">Accueil</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white">Boutique</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
              <ImageWithFallback
                src={getImageUrl(product.image)}
                alt={product.name}
                fill
                className="object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discountPercentage > 0 && (
                  <Badge variant="warning">{product.discountPercentage}% OFF</Badge>
                )}
                {product.isCustomizable && <Badge variant="primary">Sur mesure</Badge>}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                    aria-label={`Voir l'image ${idx + 1} du produit`}
                  >
                    <ImageWithFallback src={getImageUrl(img)} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <Card className="p-6 bg-white/20 backdrop-blur-md border-0">
            <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
            <p className="text-white/80 mb-4">{product.category}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              {reviewsCount !== null && (
                <span className="text-white/90">({reviewsCount} avis)</span>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white">
                  {formatPrice(discountedPrice)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-xl text-white/60 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm mb-8">
              <p className="text-white/90">{product.longDescription || product.description}</p>
            </div>

            {/* Delivery Options */}
            {variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Options de livraison</h3>
                <div className="grid grid-cols-2 gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedVariantId === variant.id
                          ? 'border-white bg-white/20'
                          : 'border-white/30 bg-white/10 hover:border-white/50'
                      }`}
                    >
                      <div className="text-white font-semibold text-sm">{variant.name}</div>
                      <div className="text-white/80 text-xs">{variant.daysMin}-{variant.daysMax} jours</div>
                      {variant.priceMultiplier > 1 && (
                        <div className="text-white/70 text-xs">+{Math.round((variant.priceMultiplier - 1) * 100)}%</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Options */}
            {product.isCustomizable && (
              <Card className="p-6 mb-8 bg-white/20 backdrop-blur-md border-0">
                <h3 className="text-lg font-semibold text-white mb-4">Options</h3>
                <div className="space-y-4">
                  {/* Options would be mapped here */}
                  <p className="text-sm text-white/80">Sélectionnez vos options personnalisées</p>
                </div>
              </Card>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border-2 border-white/30 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-white/10 text-white"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-white/10 text-white"
                >
                  +
                </button>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier
              </Button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-white/20 pt-8">
              <div>
                <p className="text-sm text-white/70 mb-1">Catégorie</p>
                <p className="font-semibold text-white">{product.category}</p>
              </div>
            </div>

            {/* Formulaire d'avis */}
            <div className="mt-8 border-t border-white/20 pt-8">
              <h3 className="text-xl font-semibold mb-4 text-white">Donner votre avis</h3>
              <ReviewForm productId={product.id} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ReviewForm({ productId }: { productId: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment, name, email }),
      })
      const data = await res.json()
      if (data.success) {
        alert('Merci ! Votre avis a été soumis.')
        setName('')
        setEmail('')
        setRating(5)
        setComment('')
      } else {
        alert('Erreur: ' + (data.error || 'Impossible de soumettre'))
      }
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'envoi de l'avis")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-2">Note</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded"
          aria-label="Note du produit"
        >
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} étoiles</option>)}
        </select>
      </div>
      <div>
        <textarea className="w-full border p-2 rounded" placeholder="Votre commentaire" value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <div>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer mon avis'}</button>
      </div>
    </form>
  )
}
