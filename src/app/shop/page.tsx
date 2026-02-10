'use client'

import React, { useState, useEffect } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui'
import { Product } from '@/types'
import { Search, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/hooks'
import { formatPrice, calculateDiscountedPrice, getImageUrl } from '@/lib/utils'
import ImageWithFallback from '@/components/ImageWithFallback'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalQuantity, setModalQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data.data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Fermer la modal avec Échap
  useEffect(() => {
    if (!selectedProduct) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedProduct])

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      cartId: 'temp',
      productId: product.id,
      quantity,
      customizations: [],
      product,
    })
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(products.map((p) => p.category))]

  return (
    <div className="bg-primary-950">
      {/* Même style que la page d'accueil, mais avec l'image de la boutique */}
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/cart-bg.jpeg')] bg-cover bg-center bg-fixed" />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-24 space-y-10 sm:space-y-12 text-primary-50">
          {/* Hero Boutique */}
          <div className="max-w-3xl">
            <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-3">
              Boutique Knit &amp; Craft
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-50 mb-4 sm:mb-6 leading-tight">
              Nos créations{' '}
              <span className="text-accent-300">tricot &amp; crochet</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-accent-100 leading-relaxed max-w-2xl">
              Découvrez notre collection de pièces faites main&nbsp;: pulls, gilets, accessoires et créations
              personnalisées, conçues pour apporter chaleur et élégance à votre quotidien.
            </p>
          </div>

          {/* Filtres */}
          <div className="bg-primary-900/70 backdrop-blur-md rounded-2xl border border-primary-800 p-6 sm:p-7 shadow-lg shadow-primary-900/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-accent-200" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-primary-900/60 border border-primary-700 rounded-lg text-primary-50 placeholder-accent-200/70 focus:outline-none focus:border-accent-400 focus:bg-primary-900/70"
                />
              </div>

              {/* Filtre catégorie */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filtrer par catégorie"
                  className="w-full px-4 py-2.5 bg-primary-900/60 border border-primary-700 rounded-lg text-primary-50 focus:outline-none focus:border-accent-400 focus:bg-primary-900/70"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'Toutes les catégories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grille produits */}
          {loading ? (
            <div className="text-center py-16">
              <p className="text-primary-50 text-lg drop-shadow-md">Chargement des produits...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-primary-50 text-lg drop-shadow-md">Aucun produit trouvé.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => {
                      setSelectedProduct(product)
                      setModalQuantity(1)
                    }}
                    onAddToCart={() => handleAddToCart(product, 1)}
                  />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  href="/bespoke"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-900/70 backdrop-blur-md hover:bg-primary-800 text-primary-50 rounded-lg border border-primary-700 transition font-medium"
                >
                  <Sparkles className="w-5 h-5 text-accent-300" aria-hidden="true" />
                  <span>Vous voulez une commande sur mesure ?</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Modal produit */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-primary-900/95 border border-primary-800 rounded-2xl shadow-2xl shadow-primary-900/60 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 p-2 rounded-full bg-primary-800/80 text-accent-100 hover:bg-primary-700"
              aria-label="Fermer"
              onClick={() => setSelectedProduct(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
              {/* Image */}
              <div>
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-primary-800">
                  <ImageWithFallback
                    src={getImageUrl(selectedProduct.image)}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Infos */}
              <div className="flex flex-col gap-4 text-primary-50">
                <div>
                  <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-2">
                    {selectedProduct.category}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">{selectedProduct.name}</h2>
                  <p className="text-sm sm:text-base text-accent-100">
                    {selectedProduct.longDescription || selectedProduct.description}
                  </p>
                </div>

                {/* Prix */}
                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold">
                      {formatPrice(
                        calculateDiscountedPrice(
                          selectedProduct.price,
                          selectedProduct.discountPercentage
                        )
                      )}
                    </span>
                    {selectedProduct.discountPercentage > 0 && (
                      <span className="text-sm text-accent-200/80 line-through">
                        {formatPrice(selectedProduct.price)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-accent-200">
                    Livraison estimée : {selectedProduct.deliveryDaysMin || 7}-
                    {selectedProduct.deliveryDaysMax || 10} jours
                  </p>
                </div>

                {/* Quantité + bouton */}
                <div className="mt-4 flex flex-col gap-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm text-accent-100">Quantité</span>
                    <div className="flex items-center border border-primary-700 rounded-lg overflow-hidden">
                      <button
                        className="px-3 py-1 text-accent-100 hover:bg-primary-800"
                        onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                      >
                        −
                      </button>
                      <span className="px-4 py-1 text-primary-50 font-semibold">
                        {modalQuantity}
                      </span>
                      <button
                        className="px-3 py-1 text-accent-100 hover:bg-primary-800"
                        onClick={() => setModalQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="mt-1 w-full"
                    onClick={() => {
                      handleAddToCart(selectedProduct, modalQuantity)
                      setSelectedProduct(null)
                    }}
                  >
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
