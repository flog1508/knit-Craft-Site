'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks'
import { Card, Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import { UserRole } from '@/types'
import Link from 'next/link'
import { BarChart3, MessageSquare, Package, ShoppingCart } from 'lucide-react'

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAuth()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  })

  // Récupère les stats une fois que l'admin est authentifié
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAdmin) {
      fetchStats()
    }
  }, [isAdmin])

  // Réactualiser les stats quand on revient sur le dashboard (ex: après confirmation d'une commande)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isAdmin) return
    const handleFocus = () => fetchStats()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAdmin])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', { credentials: 'include' })
      const data = await response.json()
      if (data.success && data.data) {
        setStats({
          totalOrders: data.data.totalOrders ?? 0,
          totalProducts: data.data.totalProducts ?? 0,
          totalRevenue: data.data.totalRevenue ?? 0,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-600">Vous devez être admin pour accéder à ce dashboard</p>
        </Card>
      </div>
    )
  }

  const menuItems = [
    {
      title: 'Produits',
      icon: Package,
      href: '/admin/products',
      description: 'Gérer les produits',
    },
    {
      title: 'Commandes',
      icon: ShoppingCart,
      href: '/admin/orders',
      description: 'Voir les commandes',
    },
    {
      title: 'Témoignages',
      icon: MessageSquare,
      href: '/admin/reviews',
      description: 'Gérer les témoignages',
    },
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-8">
          <h1 className="text-5xl font-bold text-white mb-2">Dashboard Admin</h1>
          <p className="text-white/80">Bienvenue dans l&apos;administration Knit & Craft</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Commandes', value: stats.totalOrders, icon: ShoppingCart },
            { label: 'Produits', value: stats.totalProducts, icon: Package },
            { label: 'Revenus', value: formatPrice(stats.totalRevenue || 0), icon: BarChart3 },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="p-6 bg-white/20 backdrop-blur-md rounded-lg shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <Icon className="w-12 h-12 text-white/40 opacity-70" />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link key={index} href={item.href}>
                <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer h-full bg-white/20 backdrop-blur-md rounded-lg text-white">
                  <Icon className="w-12 h-12 text-white mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/80 mb-6">{item.description}</p>
                  <Button variant="outline" className="w-full border-white/30 text-white">
                    Accéder
                  </Button>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
