'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'
import { Product } from '@/types'
import { Trash2, Edit3, Plus, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function AdminProductsPage() {
  const { isAdmin, isLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAdmin) fetchProducts()
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
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
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

  if (isLoading || loading) {
    return <div className="p-8 text-center text-accent-100">Chargement...</div>
  }
  if (!isAdmin) {
    return <div className="p-8 text-center text-red-400">Accès refusé</div>
  }

  return (
    <div className="py-10 sm:py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-accent-300" aria-hidden="true" />
          </div>
          <div>
            <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-1">Catalogue</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-50">Produits</h1>
            <p className="text-accent-100 text-sm mt-1">Gestion des produits de la boutique.</p>
          </div>
        </div>
        <Link href="/admin/products/new" className="shrink-0">
          <Button size="lg" className="flex items-center gap-2 shadow-lg shadow-primary-900/40">
            <Plus className="w-5 h-5" />
            Nouveau produit
          </Button>
        </Link>
      </div>

      <div className="bg-primary-900/70 border border-primary-800 rounded-2xl p-4 shadow-lg shadow-primary-900/40">
        <Input
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-primary-800 bg-primary-900/50 text-primary-50 placeholder:text-accent-100/60 focus:ring-accent-300/20 focus:border-accent-300 rounded-lg"
        />
      </div>

      <div className="bg-primary-900/70 border border-primary-800 rounded-2xl shadow-lg shadow-primary-900/40 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-800/50 border-b border-primary-800">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-primary-50">Image</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-primary-50">Produit</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-primary-50">Prix</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-primary-50">Stock</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm font-semibold text-primary-50">Catégorie</th>
                <th className="px-4 lg:px-6 py-3 text-right text-sm font-semibold text-primary-50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-primary-800 hover:bg-primary-800/30">
                  <td className="px-4 lg:px-6 py-3">
                    <div className="w-10 h-10 rounded overflow-hidden bg-primary-800">
                      {product.image ? (
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-accent-100/60 text-xs flex items-center justify-center h-full">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3">
                    <p className="font-medium text-primary-50">{product.name}</p>
                    <p className="text-xs text-accent-100">{product.slug}</p>
                  </td>
                  <td className="px-4 lg:px-6 py-3">
                    <p className="font-medium text-primary-50">{formatPrice(product.price)}</p>
                  </td>
                  <td className="px-4 lg:px-6 py-3">
                    <p className={product.isOutOfStock ? 'text-red-400' : 'text-green-400'}>{product.stock}</p>
                  </td>
                  <td className="px-4 lg:px-6 py-3">
                    <p className="text-accent-100 text-sm">{product.category}</p>
                  </td>
                  <td className="px-4 lg:px-6 py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-block p-2 hover:bg-primary-800 rounded mr-1"
                      aria-label={`Modifier le produit ${product.name}`}
                    >
                      <Edit3 className="w-4 h-4 text-accent-300" />
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 hover:bg-primary-800 rounded"
                      aria-label={`Supprimer le produit ${product.name}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-primary-900/70 border border-primary-800 rounded-2xl p-4 shadow-lg shadow-primary-900/40"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded overflow-hidden bg-primary-800 shrink-0">
                {product.image ? (
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-accent-100/60 text-xs flex items-center justify-center h-full">—</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-primary-50 truncate">{product.name}</p>
                <p className="text-sm text-accent-100">{formatPrice(product.price)}</p>
                <p className="text-xs text-accent-100">Stock: {product.stock}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="p-2 bg-primary-800 rounded"
                  aria-label={`Modifier le produit ${product.name}`}
                >
                  <Edit3 className="w-5 h-5 text-accent-300" />
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-2 bg-primary-800 rounded"
                  aria-label={`Supprimer le produit ${product.name}`}
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
