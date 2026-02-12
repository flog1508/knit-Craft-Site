'use client'
/* eslint-disable @next/next/no-img-element */

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

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

  useEffect(() => {
    checkAdmin()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  if (loading) {
    return (
      <div className="bg-primary-950 min-h-screen">
        <section className="relative overflow-hidden bg-primary-900 min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center bg-fixed" />
          <p className="relative z-10 text-accent-100">Chargement...</p>
        </section>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="bg-primary-950 min-h-screen">
        <section className="relative overflow-hidden bg-primary-900 min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center bg-fixed" />
          <p className="relative z-10 text-red-400">Accès refusé</p>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-primary-950 min-h-screen max-sm:-mt-14 sm:mt-0">
      <section className="relative overflow-hidden bg-primary-900 min-h-screen">
        {/* Background étendu vers le haut pour coller au header sans monter les boutons */}
        <div className="absolute -top-24 sm:-top-32 left-0 right-0 bottom-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center bg-fixed" />

        <nav className="fixed top-0 left-0 right-0 z-[100] bg-primary-900/95 backdrop-blur-md border-b border-primary-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <Link href="/admin" className="flex items-center gap-2 shrink-0">
                <img src="/images/IMG_1014.JPG.jpeg" alt="Knit & Craft" width={36} height={36} className="rounded-full object-cover ring-2 ring-accent-300/80" />
                <span className="font-bold text-primary-50 truncate tracking-wide max-w-[160px] sm:max-w-none">
                  Knit &amp; Craft Admin
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2.5 bg-red-600/90 text-primary-50 rounded-full hover:bg-red-600 transition shrink-0"
                  aria-label="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-14 pb-6 sm:pb-12 md:pb-16 lg:pb-20">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-2 bg-primary-800/80 text-accent-100 rounded-full hover:bg-primary-700 transition text-sm"
            >
              ← Voir le site
            </Link>
          </div>
          {/* Navigation des pages admin : scrollable horizontalement */}
          <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8 px-3 sm:px-4 md:px-6 lg:px-8 mb-6 sm:mb-8 max-md:[&::-webkit-scrollbar]:hidden max-md:[scrollbar-width:none] max-md:[-ms-overflow-style:none]">
            <div className="rounded-xl border border-primary-800 bg-primary-900/70 px-4 py-3 inline-block min-w-full md:min-w-0 md:w-full">
              <div className="flex gap-2 min-w-max pb-0 md:justify-center">
                {navItems.map((item) => {
                const active = isActive(item.href)
                return active ? (
                  <span
                    key={item.href}
                    className="px-4 py-2.5 rounded-full bg-accent-400/90 text-primary-950 font-medium cursor-default text-sm whitespace-nowrap shrink-0"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2.5 rounded-full text-accent-100 hover:bg-primary-800 hover:text-primary-50 transition text-sm whitespace-nowrap shrink-0 border border-primary-700"
                  >
                    {item.label}
                  </Link>
                )
              })}
              </div>
            </div>
          </div>

          {children}
        </div>
      </section>
    </div>
  )
}