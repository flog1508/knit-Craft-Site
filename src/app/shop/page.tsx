'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { Input, Button } from '@/components/ui'
import { Product } from '@/types'
import { Search, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ShopPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Rediriger l'admin vers le dashboard
  useEffect(() => {
    if (session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN') {
      router.push('/admin')
    }
  }, [session, router])

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

  // Si l'admin essaie d'accéder directement, montrer un message
  if (session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN') {
    return (
      <div className="min-h-screen bg-primary-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-50">
          <AlertCircle className="w-12 h-12 text-accent-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Accès non disponible</h1>
          <p className="text-accent-100 mb-8">L&apos;admin ne peut pas acheter des produits</p>
          <Button variant="primary" onClick={() => router.push('/admin')}>
            Aller au dashboard
          </Button>
        </div>
      </div>
    )
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
        <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/cart-bg.jpeg')] bg-cover bg-center" />

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
                  <ProductCard key={product.id} product={product} />
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
    </div>
  )
}
