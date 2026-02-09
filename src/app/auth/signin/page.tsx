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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/images/Fond_connexion.jpeg)' }}>
      <Card className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-md border border-white/20 flex flex-col items-center">
        {/* Logo removed as requested */}
        <h1 className="text-3xl font-bold text-white mb-6">Connexion Administrateur</h1>
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg w-full">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@email.com"
            required
            className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
          />
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
          />
          <Button type="submit" size="lg" isLoading={loading} className="w-full bg-[#8B4513] hover:bg-[#6B3410]">
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
