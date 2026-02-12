'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks'
import { Order, OrderStatus } from '@/types'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { Badge } from '@/components/ui'
import Link from 'next/link'
import { ArrowRight, ShoppingCart } from 'lucide-react'

export default function AdminOrdersPage() {
  const { isAdmin, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdmin) fetchOrders()
  }, [isAdmin])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders', { credentials: 'include' })
      const data = await response.json()
      const raw = data?.data ?? data
      setOrders(Array.isArray(raw) ? raw : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<OrderStatus, string> = {
    PENDING: 'warning',
    CONFIRMED: 'primary',
    PROCESSING: 'primary',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'danger',
  }

  if (isLoading || loading) {
    return <div className="p-8 text-center text-accent-100">Chargement...</div>
  }
  if (!isAdmin) {
    return <div className="p-8 text-center text-red-400">Accès refusé</div>
  }

  return (
    <div className="py-10 sm:py-12 space-y-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center shrink-0">
          <ShoppingCart className="w-6 h-6 text-accent-300" aria-hidden="true" />
        </div>
        <div>
          <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-1">Suivi</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-50">Commandes</h1>
          <p className="text-accent-100 text-sm mt-1">Gestion des commandes clients.</p>
        </div>
      </div>

      <div className="bg-primary-900/70 border border-primary-800 rounded-2xl shadow-lg shadow-primary-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-800/50 border-b border-primary-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary-50">Numéro</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary-50">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary-50">Montant</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary-50">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary-50">Date</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary-50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(orders) ? orders : []).map((order) => (
                <tr key={order.id} className="border-b border-primary-800 hover:bg-primary-800/30">
                  <td className="px-6 py-4">
                    <p className="font-medium text-primary-50">{order.orderNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-primary-50">{order.firstName} {order.lastName}</p>
                      <p className="text-sm text-accent-100">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-primary-50">{formatPrice(order.totalPrice)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[order.status] as any}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-accent-100">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <button className="flex items-center gap-1 text-accent-300 hover:text-accent-200">
                        Modifier <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
