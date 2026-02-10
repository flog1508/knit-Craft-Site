'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useCart } from '@/hooks'
import { ShoppingCart, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

export const Header: React.FC = () => {
  const { data: session } = useSession()
  const { items } = useCart()
  const pathname = usePathname()

  // Ne pas afficher le header public sur les pages /admin
  if (pathname?.startsWith('/admin')) return null

  return (
    <header className="sticky top-0 z-50 bg-primary-900/95 backdrop-blur-md border-b border-primary-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/images/WhatsApp Image 2026-02-01 at 22.50.19.jpeg"
              alt="Knit & Craft Logo"
              width={70}
              height={70}
              className="object-cover bg-transparent"
              style={{ background: 'transparent' }}
            />
            <span className="font-bold text-lg hidden sm:inline text-accent-300">Knit & Craft</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 sm:gap-8 flex-wrap justify-center flex-1 mx-4">
            {pathname !== '/' && (
              <Link
                href="/"
                className="text-accent-100 hover:text-accent-400 transition-colors text-sm sm:text-base"
              >
                Accueil
              </Link>
            )}
            {pathname !== '/shop' && (
              <Link
                href="/shop"
                className="text-accent-100 hover:text-accent-400 transition-colors text-sm sm:text-base"
              >
                Boutique
              </Link>
            )}
            {pathname !== '/reviews' && (
              <Link
                href="/reviews"
                className="text-accent-100 hover:text-accent-400 transition-colors text-sm sm:text-base"
              >
                Avis
              </Link>
            )}
            {pathname !== '/about' && (
              <Link
                href="/about"
                className="text-accent-100 hover:text-accent-400 transition-colors text-sm sm:text-base"
              >
                À propos
              </Link>
            )}
            {pathname !== '/bespoke' && (
              <Link
                href="/bespoke"
                className="text-accent-100 hover:text-accent-400 transition-colors text-sm sm:text-base"
              >
                Sur mesure
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Cart (ne pas afficher sur la page panier) */}
            {pathname !== '/cart' && (
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-accent-100 hover:text-accent-400 transition-colors" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            )}

            {/* Admin connexion uniquement */}
            {session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN' ? (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-accent-100 hover:text-accent-400"
              >
                <User className="w-5 h-5 text-accent-100" />
                <span className="hidden sm:inline text-sm text-accent-100">
                  {session.user.name}
                </span>
              </Link>
            ) : pathname !== '/auth/signin' ? (
              <Link
                href="/auth/signin"
                className="text-accent-100 hover:text-accent-400 transition-colors text-sm sm:text-base"
              >
                Admin
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
