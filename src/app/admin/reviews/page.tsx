'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks'
import { Card, Button } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { Trash, Check, X } from 'lucide-react'
import Link from 'next/link'

export default function AdminReviewsPage() {
  const { isAdmin, isLoading } = useAuth()
  const [reviews, setReviews] = useState<any[]>([])

  // Chargement des avis côté admin
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

  if (isLoading) return <div>Chargement...</div>
  if (!isAdmin) return <div>Accès refusé</div>

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Témoignages</h1>
          <Link href="/admin">
            <Button>Retour</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id} className="p-4 flex justify-between items-start bg-white/20 backdrop-blur-md rounded-lg">
              <div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-white">{r.user?.name || 'Client'}</div>
                  <div className="text-sm text-white/70">{formatDate(r.createdAt)}</div>
                </div>
                {r.image && (
                  <img src={r.image} alt="Review" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
                <div className="mt-2 text-white">{r.comment}</div>
                <div className="mt-2 text-sm text-white/80">Note: {r.rating}/5</div>
              </div>
              <div className="flex flex-col gap-2">
                {r.isVerified ? (
                  <Button variant="ghost" onClick={() => toggleVerify(r.id, false)}>
                    <X className="w-4 h-4 mr-2" /> Désactiver
                  </Button>
                ) : (
                  <Button onClick={() => toggleVerify(r.id, true)}>
                    <Check className="w-4 h-4 mr-2" /> Vérifier
                  </Button>
                )}
                <Button variant="secondary" onClick={() => deleteReview(r.id)}>
                  <Trash className="w-4 h-4 mr-2" /> Supprimer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
