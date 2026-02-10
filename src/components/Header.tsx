'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useCart } from '@/hooks'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export const Header: React.FC = () => {
  const { data: session } = useSession()
  const { items } = useCart()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement | null>(null)

  // Fermer le menu au clic extérieur ou touche Échap
  useEffect(() => {
    if (!mobileMenuOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!headerRef.current) return
      if (!headerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen])

  // Ne pas afficher le header public sur les pages /admin
  if (pathname?.startsWith('/admin')) return null

  const navItems = [
    { href: '/', label: 'Accueil', show: pathname !== '/' },
    { href: '/shop', label: 'Boutique', show: pathname !== '/shop' },
    { href: '/reviews', label: 'Avis', show: pathname !== '/reviews' },
    { href: '/about', label: 'À propos', show: pathname !== '/about' },
    { href: '/bespoke', label: 'Sur mesure', show: pathname !== '/bespoke' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-primary-900/95 backdrop-blur-md border-b border-primary-800 shadow-lg">
      <div
        ref={headerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
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

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8 flex-wrap justify-center flex-1 mx-4">
            {navItems.map((item) =>
              item.show ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-accent-100 hover:text-accent-400 transition-colors text-sm lg:text-base"
                >
                  {item.label}
                </Link>
              ) : null
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

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-accent-100 hover:text-accent-400 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-800">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) =>
                item.show ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 text-accent-100 hover:text-accent-400 hover:bg-primary-800/50 rounded transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : null
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
