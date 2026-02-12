'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { Trash, Check, X, MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'

export default function AdminReviewsPage() {
  const { isAdmin, isLoading } = useAuth()
  const [reviews, setReviews] = useState<any[]>([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAdmin) fetchReviews()
  }, [isAdmin])

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews')
      const data = await res.json()
      if (data.success) setReviews(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const toggleVerify = async (id: string, value: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: value }),
      })
      const data = await res.json()
      if (data.success) fetchReviews()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Supprimer cet avis ?')) return
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) fetchReviews()
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) return <div className="text-center py-8 text-accent-100">Chargement...</div>
  if (!isAdmin) return <div className="text-center py-8 text-red-400">Accès refusé</div>

  return (
    <div className="py-10 sm:py-12 space-y-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6 text-accent-300" aria-hidden="true" />
          </div>
          <div>
            <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-1">
              Avis clients
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-50">
              Témoignages
            </h1>
            <p className="text-accent-100 text-sm mt-1">
              Modérez et mettez en avant les avis laissés par vos clients.
            </p>
          </div>
        </div>
        <Link href="/admin">
          <Button variant="outline" className="border-accent-300 text-accent-100 hover:bg-accent-300/10">
            Retour
          </Button>
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-primary-900/70 border border-primary-800 rounded-2xl shadow-lg shadow-primary-900/40 p-10 text-center">
          <MessageSquare className="w-12 h-12 text-accent-300/60 mx-auto mb-3" />
          <p className="text-accent-100">Aucun témoignage pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 shadow-lg shadow-primary-900/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-semibold text-primary-50">
                      {r.user?.name || 'Client'}
                    </span>
                    <span className="text-accent-100 text-sm">
                      {formatDate(r.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary-800/80 text-accent-200 text-sm font-medium">
                      <Star className="w-4 h-4 fill-accent-300 text-accent-300" />
                      {r.rating}/5
                    </span>
                    {r.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-accent-400/20 text-accent-300 text-xs font-medium">
                        <Check className="w-3.5 h-3.5" /> Vérifié
                      </span>
                    )}
                  </div>
                  {r.image && (
                    <img
                      src={r.image}
                      alt="Avis client"
                      className="mt-3 w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl border border-primary-800"
                    />
                  )}
                  <p className="mt-3 text-accent-100 leading-relaxed whitespace-pre-wrap">
                    {r.comment}
                  </p>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                  {r.isVerified ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVerify(r.id, false)}
                      className="border-primary-700 text-accent-100 hover:bg-primary-800"
                    >
                      <X className="w-4 h-4 mr-2" /> Désactiver
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => toggleVerify(r.id, true)}
                      className="shadow-lg shadow-primary-900/40"
                    >
                      <Check className="w-4 h-4 mr-2" /> Vérifier
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteReview(r.id)}
                    className="border-red-400/50 text-red-400 hover:bg-red-400/10"
                  >
                    <Trash className="w-4 h-4 mr-2" /> Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
