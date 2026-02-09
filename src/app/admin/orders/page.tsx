'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks'
import { Card } from '@/components/ui'
import { Order, OrderStatus } from '@/types'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { Badge } from '@/components/ui'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AdminOrdersPage() {
  const { isAdmin, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdmin) {
      fetchOrders()
    }
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
    return <div className="p-8 text-center text-white">Chargement...</div>
  }

  if (!isAdmin) {
    return <div className="p-8 text-center text-red-400">Accès refusé</div>
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 bg-white/20 backdrop-blur-md rounded-lg p-6">
          <h1 className="text-4xl font-bold text-white mb-2">Commandes</h1>
          <p className="text-white/80">Gestion des commandes clients</p>
        </div>

        <Card className="overflow-hidden bg-white/20 backdrop-blur-md rounded-lg border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Numéro</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Client</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Montant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Date</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(orders) ? orders : []).map((order) => (
                  <tr key={order.id} className="border-b border-white/10 hover:bg-white/10">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{order.orderNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{order.firstName} {order.lastName}</p>
                        <p className="text-sm text-white/70">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{formatPrice(order.totalPrice)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusColors[order.status] as any}>{order.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <button className="flex items-center gap-1 text-blue-300 hover:text-blue-200">
                          Modifier <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
