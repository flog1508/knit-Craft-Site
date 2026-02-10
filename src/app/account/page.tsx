'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'
import { Card, Button } from '@/components/ui'
import Link from 'next/link'
import { User, Package, LogOut, Heart, ShoppingBag, Mail, Info } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function AccountPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const { data: session } = useSession()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md p-8 text-center">
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour accéder à votre compte</p>
          <Link href="/auth/signin">
            <Button size="lg" className="w-full">
              Se connecter
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon Compte</h1>
          <p className="text-gray-600">Bienvenue, {user?.name || user?.email}!</p>
        </div>

        {/* Profile Card */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </Button>
          </div>
        </Card>

        {/* Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orders */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-primary-600" />
              <h3 className="text-2xl font-bold text-gray-900">Mes Commandes</h3>
            </div>
            <p className="text-gray-600 mb-6">Consultez l&apos;historique de vos commandes et leur statut</p>
            <Link href="/account/orders">
              <Button variant="outline" className="w-full">
                Voir mes commandes
              </Button>
            </Link>
          </Card>

          {/* Wishlist */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-red-500" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-gray-900">Mes Favoris</h3>
            </div>
            <p className="text-gray-600 mb-6">Consultez vos produits favoris sauvegardés</p>
            <Button variant="outline" className="w-full" disabled>
              Voir mes favoris
            </Button>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/shop">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-primary-600" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900">Continuer les achats</h3>
            </Card>
          </Link>
          <Link href="/contact">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <Mail className="w-10 h-10 mx-auto mb-3 text-primary-600" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900">Nous contacter</h3>
            </Card>
          </Link>
          <Link href="/about">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <Info className="w-10 h-10 mx-auto mb-3 text-primary-600" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900">À propos</h3>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
