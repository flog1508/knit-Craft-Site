'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Package, Shirt, Sparkles, FileText, Lightbulb, Inbox, Bell, CheckCircle, Cog, Truck, XCircle } from 'lucide-react'
import { Order } from '@/types'
import { formatPrice, formatDateTime } from '@/lib/utils'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    customRequests: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchRecentOrders()
  }, [])

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes, customRes] = await Promise.all([
        fetch('/api/admin/orders').catch(() => ({ json: () => [] })),
        fetch('/api/products').catch(() => ({ json: () => [] })),
        fetch('/api/bespoke').catch(() => ({ json: () => [] })),
      ])

      const orders = await ordersRes.json()
      const products = await productsRes.json()
      const custom = await customRes.json()

      setStats({
        orders: Array.isArray(orders) ? orders.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        customRequests: Array.isArray(custom) ? custom.length : 0,
      })
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      // Afficher les 5 dernières commandes
      const orders = Array.isArray(data.data) ? data.data : []
      setRecentOrders(orders.slice(0, 5))
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Titre */}
      <div className="mb-8 bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-white drop-shadow">Dashboard Admin</h1>
        <p className="text-white/80 mt-2">Bienvenue ! Gérez votre boutique Knit & Craft</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Commandes</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{loading ? '...' : stats.orders}</p>
            </div>
            <Package className="w-14 h-14 text-blue-600" aria-hidden="true" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Produits</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{loading ? '...' : stats.products}</p>
            </div>
            <Shirt className="w-14 h-14 text-green-600" aria-hidden="true" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Demandes Sur Mesure</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{loading ? '...' : stats.customRequests}</p>
            </div>
            <Sparkles className="w-14 h-14 text-purple-600" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Menu principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Produits */}
        <Link
          href="/admin/products"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition cursor-pointer block"
        >
          <Shirt className="w-14 h-14 mb-4 text-primary-600" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gérer les Produits</h2>
          <p className="text-gray-600 mb-4">
            Ajouter de nouveaux produits, modifier les existants ou en supprimer
          </p>
          <div className="text-blue-600 font-bold">
            Accéder → 
          </div>
        </Link>

        {/* À Propos */}
        <Link
          href="/admin/about"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition cursor-pointer block"
        >
          <FileText className="w-14 h-14 mb-4 text-green-600" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Éditer &quot;À Propos&quot;</h2>
          <p className="text-gray-600 mb-4">
            Modifiez votre présentation, biographie et photo
          </p>
          <div className="text-green-600 font-bold">
            Éditer → 
          </div>
        </Link>

        {/* Commandes */}
        <Link
          href="/admin/orders"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition cursor-pointer block"
        >
          <Package className="w-14 h-14 mb-4 text-purple-600" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Voir les Commandes</h2>
          <p className="text-gray-600 mb-4">
            Consultez les commandes reçues et mettez à jour leur statut
          </p>
          <div className="text-purple-600 font-bold">
            Accéder → 
          </div>
        </Link>

        {/* Demandes Sur Mesure */}
        <Link
          href="/admin/requests"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition cursor-pointer block"
        >
          <Sparkles className="w-14 h-14 mb-4 text-pink-500" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Demandes Personnalisées</h2>
          <p className="text-gray-600 mb-4">
            Répondez aux demandes sur mesure de vos clients
          </p>
          <div className="text-pink-600 font-bold">
            Accéder → 
          </div>
        </Link>
      </div>

      {/* Aide rapide */}
      <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-700" aria-hidden="true" />
          <span>Besoin d&apos;aide ?</span>
        </h3>
        <p className="text-blue-800">
          Tous les formulaires sont simples et intuitifs. N&apos;hésitez pas à explorer ! 
          Si quelque chose ne fonctionne pas comme prévu, revenez simplement en arrière.
        </p>
      </div>

      {/* Boîte mail - Notifications de commandes */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Inbox className="w-6 h-6" aria-hidden="true" />
            <span>Dernières commandes</span>
          </h2>
          <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700 font-medium">
            Voir toutes →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}>
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {order.status === 'PENDING' && <Bell className="w-6 h-6 text-yellow-500" aria-hidden="true" />}
                          {order.status === 'CONFIRMED' && <CheckCircle className="w-6 h-6 text-green-600" aria-hidden="true" />}
                          {order.status === 'PROCESSING' && <Cog className="w-6 h-6 text-blue-600" aria-hidden="true" />}
                          {order.status === 'SHIPPED' && <Truck className="w-6 h-6 text-purple-600" aria-hidden="true" />}
                          {order.status === 'DELIVERED' && <Package className="w-6 h-6 text-green-700" aria-hidden="true" />}
                          {order.status === 'CANCELLED' && <XCircle className="w-6 h-6 text-red-500" aria-hidden="true" />}
                        </span>
                        <div>
                          <p className="font-bold text-gray-900">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{order.firstName} {order.lastName}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{order.email} • {order.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(order.totalPrice)}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(order.createdAt)}</p>
                      <p className={`text-xs font-medium mt-1 ${
                        order.status === 'PENDING' ? 'text-yellow-600' :
                        order.status === 'DELIVERED' ? 'text-green-600' :
                        order.status === 'CANCELLED' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
