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
    return <div className="p-8 text-center text-white">Chargement...</div>
  }

  if (!isAdmin) {
    return <div className="p-8 text-center text-red-400">Accès refusé</div>
  }

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/images/WhatsApp%20Image%202026-02-06%20at%2013.15.49%20(1).jpeg')" }}>
      {/* Filtre sombre sur le fond */}
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-0" aria-hidden="true" />
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-gray-900/90 md:bg-white/20 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link href="/admin" className="flex items-center gap-2 shrink-0" onClick={() => setMobileMenuOpen(false)}>
                <img src="/images/IMG_1014.JPG.jpeg" alt="Knit & Craft" width={36} height={36} className="rounded-full object-cover" />
                <span className="font-bold text-white truncate hidden sm:inline">Knit & Craft Admin</span>
              </Link>
              <div className="hidden md:flex gap-1 ml-4">
                {navItems.map((item) => {
                  const active = isActive(item.href)
                  return active ? (
                    <span key={item.href} className="px-3 py-2 rounded bg-white/30 text-white font-medium cursor-default text-sm">
                      {item.label}
                    </span>
                  ) : (
                    <Link key={item.href} href={item.href} className="px-3 py-2 rounded text-white/90 hover:bg-white/20 hover:text-white transition text-sm">
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="hidden sm:inline px-3 py-2 bg-white/20 text-white rounded hover:bg-white/30 transition text-sm">← Voir le site</Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="px-3 py-2 bg-red-600/80 text-white rounded hover:bg-red-600 transition text-sm shrink-0">Déconnexion</button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/20 rounded"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          {/* Menu mobile */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-white/20 bg-black/30 backdrop-blur-md">
              <div className="flex flex-col gap-1">
                <Link href="/" className="px-4 py-2 text-white hover:bg-white/20 rounded sm:hidden" onClick={() => setMobileMenuOpen(false)}>← Voir le site</Link>
                {navItems.map((item) => {
                  const active = isActive(item.href)
                  return active ? (
                    <span key={item.href} className="px-4 py-3 rounded bg-white/30 text-white font-medium">{item.label}</span>
                  ) : (
                    <Link key={item.href} href={item.href} className="px-4 py-3 rounded text-white/90 hover:bg-white/20" onClick={() => setMobileMenuOpen(false)}>
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 pt-20 sm:pt-24 pb-8 relative z-10">
        {children}
      </div>
    </div>
  )
}