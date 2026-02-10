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
      <div className="min-h-screen bg-primary-950 flex items-center justify-center">
        <p className="text-accent-100">Chargement...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md p-8 text-center bg-primary-900/80 border border-primary-800 text-primary-50">
          <h1 className="text-2xl font-bold mb-4">Accès Refusé</h1>
          <p className="text-accent-100">Vous devez être admin pour accéder à ce dashboard.</p>
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
    <div className="py-10 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-12 bg-primary-900/80 border border-primary-800 rounded-2xl shadow-lg shadow-primary-900/40 p-6 sm:p-8">
          <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-3">
            Administration Knit &amp; Craft
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-50 mb-3">
            Dashboard admin
          </h1>
          <p className="text-sm sm:text-base text-accent-100">
            Suivez vos commandes, produits et avis dans un espace pensé comme le reste du site.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-10 sm:mb-12">
          {[
            { label: 'Commandes', value: stats.totalOrders, icon: ShoppingCart },
            { label: 'Produits', value: stats.totalProducts, icon: Package },
            { label: 'Revenus', value: formatPrice(stats.totalRevenue || 0), icon: BarChart3 },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="p-5 sm:p-6 bg-primary-900/80 border border-primary-800 rounded-2xl shadow-lg shadow-primary-900/40 text-primary-50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-accent-200">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary-50 mt-1">{stat.value}</p>
                  </div>
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-accent-200/70" />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-4xl">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link key={index} href={item.href}>
                <Card className="p-6 sm:p-7 lg:p-8 hover:shadow-xl transition-shadow cursor-pointer h-full bg-primary-900/80 border border-primary-800 rounded-2xl text-primary-50">
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-accent-200 mb-4 opacity-90" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-primary-50 mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-accent-100 mb-5">{item.description}</p>
                  <Button
                    variant="outline"
                    className="w-full border-accent-300 text-accent-100 hover:bg-accent-300/10"
                  >
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
