'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Card } from '@/components/ui'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

function ErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Email ou mot de passe incorrect',
    EmailNotVerified: 'Veuillez vérifier votre email',
    Default: 'Une erreur est survenue lors de la connexion',
  }

  const message = errorMessages[error as string] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Erreur de connexion</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-900 text-center">{message}</p>
        </div>

        <div className="space-y-3">
          <Link href="/auth/signin">
            <Button size="lg" className="w-full">
              Réessayer
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => router.push('/')}
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
