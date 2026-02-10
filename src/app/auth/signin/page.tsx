'use client'

import React, { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card } from '@/components/ui'
import Image from 'next/image'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(result.error)
    } else {
      // Récupérer la session et rediriger selon le role
      const session = await getSession()
      const role = (session?.user as any)?.role
      if (role === 'ADMIN' || role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/account')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-primary-950">
      <section className="relative overflow-hidden bg-primary-900 min-h-screen flex items-center">
        {/* Fond dans le même esprit que la home */}
        <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center bg-fixed" />

        <div className="relative w-full">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-24 flex justify-center">
            <Card className="w-full max-w-md bg-primary-900/80 border border-primary-800 rounded-2xl shadow-2xl shadow-primary-900/60 px-6 sm:px-8 py-8 sm:py-10">
              <div className="mb-6 sm:mb-8 text-center">
                <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-3">
                  Espace réservé
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-50 mb-2">
                  Connexion administrateur
                </h1>
                <p className="text-xs sm:text-sm text-accent-100">
                  Accédez à l&apos;administration de Knit &amp; Craft.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/15 border border-red-400/40 rounded-xl">
                  <p className="text-red-200 text-xs sm:text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@email.com"
                  required
                  className="bg-primary-900/70 border-primary-700 text-primary-50 placeholder:text-accent-300/70"
                />
                <Input
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-primary-900/70 border-primary-700 text-primary-50 placeholder:text-accent-300/70"
                />
                <Button
                  type="submit"
                  size="lg"
                  isLoading={loading}
                  className="w-full bg-accent-400 text-primary-950 hover:bg-accent-300 shadow-lg shadow-primary-900/40"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/" className="text-xs sm:text-sm text-accent-200 hover:text-accent-100 underline-offset-4 hover:underline">
                  ← Retour au site
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
