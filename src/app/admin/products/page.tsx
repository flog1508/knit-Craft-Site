'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks'
import { Button, Card, Input } from '@/components/ui'
import Link from 'next/link'
import { Product } from '@/types'
import { Trash2, Edit3, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function AdminProductsPage() {
  const { isAdmin, isLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Chargement des produits quand l'admin est connecté
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAdmin) {
      fetchProducts()
    }
  }, [isAdmin])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products?take=100', { credentials: 'include' })
      const data = await response.json()
      const raw = data?.data ?? data
      setProducts(Array.isArray(raw) ? raw : [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const productList = Array.isArray(products) ? products : []
  const filteredProducts = productList.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deleteProduct = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setProducts((prev) => (Array.isArray(prev) ? prev : []).filter((p) => p.id !== id))
          alert('Produit supprimé avec succès')
        } else {
          alert('Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }

  if (isLoading || loading) {
    return <div className="p-8 text-center text-white">Chargement...</div>
  }

  if (!isAdmin) {
    return <div className="p-8 text-center text-red-400">Accès refusé</div>
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl p-4 sm:p-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">Produits</h1>
            <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">Gestion des produits de la boutique</p>
          </div>
          <Link href="/admin/products/new" className="shrink-0">
            <Button size="lg" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nouveau produit
            </Button>
          </Link>
        </div>

        <Card className="p-4 mb-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg">
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/15 border-white/30 text-white placeholder:text-white/50 rounded-lg focus:ring-2 focus:ring-white/40"
          />
        </Card>

        <Card className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-white">Image</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-white">Produit</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-white">Prix</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-white">Stock</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-white">Catégorie</th>
                  <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/10 hover:bg-white/10">
                    <td className="px-4 lg:px-6 py-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-white/10">
                        {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <span className="text-white/50 text-xs flex items-center justify-center h-full">—</span>}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3"><p className="font-medium text-white">{product.name}</p><p className="text-xs text-white/70">{product.slug}</p></td>
                    <td className="px-4 lg:px-6 py-3"><p className="font-medium text-white">{formatPrice(product.price)}</p></td>
                    <td className="px-4 lg:px-6 py-3"><p className={product.isOutOfStock ? 'text-red-300' : 'text-green-300'}>{product.stock}</p></td>
                    <td className="px-4 lg:px-6 py-3"><p className="text-white/80 text-sm">{product.category}</p></td>
                    <td className="px-4 lg:px-6 py-3 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-block p-2 hover:bg-white/20 rounded mr-1"
                        aria-label={`Modifier le produit ${product.name}`}
                      >
                        <Edit3 className="w-4 h-4 text-blue-300" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 hover:bg-white/20 rounded"
                        aria-label={`Supprimer le produit ${product.name}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-300" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="md:hidden space-y-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg p-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded overflow-hidden bg-white/10 shrink-0">
                  {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <span className="text-white/50 text-xs flex items-center justify-center h-full">—</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{product.name}</p>
                  <p className="text-sm text-white/70">{formatPrice(product.price)}</p>
                  <p className="text-xs text-white/60">Stock: {product.stock}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="p-2 bg-white/20 rounded"
                    aria-label={`Modifier le produit ${product.name}`}
                  >
                    <Edit3 className="w-5 h-5 text-blue-300" />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 bg-white/20 rounded"
                    aria-label={`Supprimer le produit ${product.name}`}
                  >
                    <Trash2 className="w-5 h-5 text-red-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
