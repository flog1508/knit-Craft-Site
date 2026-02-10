'use client'
/* eslint-disable @next/next/no-img-element */

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Accueil' },
  { href: '/admin/products', label: 'Produits' },
  { href: '/admin/about', label: 'À Propos' },
  { href: '/admin/orders', label: 'Commandes' },
  { href: '/admin/requests', label: 'Demandes' },
  { href: '/admin/reviews', label: 'Témoignages' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Vérification admin au montage (on ne met pas checkAdmin dans les deps pour éviter une boucle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      
      if (session?.user?.role === 'ADMIN') {
        setIsAdmin(true)
      } else {
        router.push('/auth/signin')
      }
    } catch (error) {
      router.push('/auth/signin')
    } finally {
      setLoading(false)
    }
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin' || pathname === '/admin/dashboard'
    return pathname.startsWith(href)
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center">
        <p className="text-accent-100">Chargement...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center">
        <p className="text-red-400">Accès refusé</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-950 relative">
      {/* Fond dans le même esprit que la home */}
      <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-primary-950/60" aria-hidden="true" />

      <nav className="fixed top-0 left-0 right-0 z-[100] bg-primary-900/95 backdrop-blur-md border-b border-primary-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link href="/admin" className="flex items-center gap-2 shrink-0" onClick={() => setMobileMenuOpen(false)}>
                <img src="/images/IMG_1014.JPG.jpeg" alt="Knit & Craft" width={36} height={36} className="rounded-full object-cover ring-2 ring-accent-300/80" />
                <span className="font-bold text-primary-50 truncate hidden sm:inline tracking-wide">
                  Knit &amp; Craft Admin
                </span>
              </Link>
              <div className="hidden md:flex gap-1 ml-4">
                {navItems.map((item) => {
                  const active = isActive(item.href)
                  return active ? (
                    <span
                      key={item.href}
                      className="px-3 py-2 rounded-full bg-accent-400/90 text-primary-950 font-medium cursor-default text-sm"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-3 py-2 rounded-full text-accent-100 hover:bg-primary-800 hover:text-primary-50 transition text-sm"
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden sm:inline px-3 py-2 bg-primary-800/80 text-accent-100 rounded-full hover:bg-primary-700 transition text-sm"
              >
                ← Voir le site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-2 bg-red-600/90 text-primary-50 rounded-full hover:bg-red-600 transition text-sm shrink-0"
              >
                Déconnexion
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-accent-100 hover:bg-primary-800 rounded-full"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          {/* Menu mobile */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-primary-800 bg-primary-900/95 backdrop-blur-md">
              <div className="flex flex-col gap-1">
                <Link
                  href="/"
                  className="px-4 py-2 text-accent-100 hover:bg-primary-800 rounded sm:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ← Voir le site
                </Link>
                {navItems.map((item) => {
                  const active = isActive(item.href)
                  return active ? (
                    <span
                      key={item.href}
                      className="px-4 py-3 rounded-full bg-accent-400/90 text-primary-950 font-medium"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-4 py-3 rounded-full text-accent-100 hover:bg-primary-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 pb-10">
        {children}
      </div>
    </div>
  )
}