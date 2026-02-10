'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Input } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { Star, ThumbsUp, Image as ImageIcon, Video, X } from 'lucide-react'

interface Review {
  id: string
  productId: string
  rating: number
  comment: string
  image?: string
  video?: string
  user?: { name?: string }
  createdAt: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [totalReviews, setTotalReviews] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
    image: '',
    video: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [videoPreview, setVideoPreview] = useState<string>('')
  const [imageName, setImageName] = useState<string>('')
  const [lightboxSrc, setLightboxSrc] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [helpfulDisabled, setHelpfulDisabled] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('helpful_voted')
      if (stored) {
        const arr = JSON.parse(stored) as string[]
        const map: Record<string, boolean> = {}
        arr.forEach(id => (map[id] = true))
        setHelpfulDisabled(map)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews/top')
      const data = await response.json()
      setReviews(data.data || [])
      // fetch total reviews count
      try {
        const c = await fetch('/api/reviews/count')
        const cd = await c.json()
        if (cd.success) setTotalReviews(cd.data.count || 0)
      } catch (err) {
        console.error('Error fetching total reviews count', err)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setFormData({ name: '', email: '', rating: 5, comment: '', image: '', video: '' })
        setImagePreview('')
        setVideoPreview('')
        fetchReviews()
        alert('Avis ajouté avec succès!')
      } else {
        alert('Erreur: ' + (data.error || 'Impossible d\'ajouter l\'avis'))
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Erreur lors de l\'ajout de l\'avis: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }))
  }

  const handleHelpful = async (id: string) => {
    if (helpfulDisabled[id]) return

    // mark disabled immediately and persist locally
    setHelpfulDisabled(prev => ({ ...prev, [id]: true }))
    try {
      const stored = localStorage.getItem('helpful_voted')
      const arr = stored ? JSON.parse(stored) as string[] : []
      if (!arr.includes(id)) {
        arr.push(id)
        localStorage.setItem('helpful_voted', JSON.stringify(arr))
      }
    } catch (e) {
      // ignore storage errors
    }

    // optimistic update
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful: (r as any).helpful ? (r as any).helpful + 1 : 1 } : r))

    try {
      const res = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        // revert optimistic update and re-enable button to allow retry
        setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful: (r as any).helpful ? (r as any).helpful - 1 : 0 } : r))
        setHelpfulDisabled(prev => { const p = { ...prev }; delete p[id]; return p })
        try {
          const stored = localStorage.getItem('helpful_voted')
          const arr = stored ? JSON.parse(stored) as string[] : []
          const idx = arr.indexOf(id)
          if (idx > -1) { arr.splice(idx, 1); localStorage.setItem('helpful_voted', JSON.stringify(arr)) }
        } catch (e) {}
        console.error('Helpful API error', data)
        if (res.status === 429) alert('Vous avez déjà marqué cet avis comme utile.')
      }
    } catch (err) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful: (r as any).helpful ? (r as any).helpful - 1 : 0 } : r))
      setHelpfulDisabled(prev => { const p = { ...prev }; delete p[id]; return p })
      try {
        const stored = localStorage.getItem('helpful_voted')
        const arr = stored ? JSON.parse(stored) as string[] : []
        const idx = arr.indexOf(id)
        if (idx > -1) { arr.splice(idx, 1); localStorage.setItem('helpful_voted', JSON.stringify(arr)) }
      } catch (e) {}
      console.error('Helpful request failed', err)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setImageName(file.name)
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      setImagePreview(base64)
      setFormData(prev => ({
        ...prev,
        image: base64,
      }))
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      setVideoPreview(base64)
      setFormData(prev => ({
        ...prev,
        video: base64,
      }))
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview('')
    setFormData(prev => ({
      ...prev,
      image: '',
    }))
  }

  const removeVideo = () => {
    setVideoPreview('')
    setFormData(prev => ({
      ...prev,
      video: '',
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center text-primary-50">
        Chargement...
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-primary-950 relative">
      <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/newsletter.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-primary-900/80" />

      <div className="relative max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-50 mb-3 sm:mb-4">
          Témoignages Clients
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-accent-100 mb-2 sm:mb-4">
          Les avis de nos clients satisfaits
        </p>
        {totalReviews !== null && (
          <p className="text-sm text-accent-100/90 mb-8">{totalReviews} avis publiés</p>
        )}

        {/* Form Ajouter un avis */}
        <Card className="mb-6 sm:mb-8 p-3 sm:p-6 md:p-8 bg-primary-900/70 backdrop-blur-xl border border-primary-800 shadow-lg">
          <h2 className="text-lg sm:text-2xl font-bold text-primary-50 mb-3 sm:mb-6">
            Donner votre avis
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="Votre nom"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-transparent border-primary-700 text-white placeholder:text-white/50"
              />
              <Input
                label="Votre email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-transparent border-primary-700 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-primary-50 mb-2">
                Note
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 text-sm bg-transparent border-2 border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400 text-primary-50 appearance-none cursor-pointer [&>option]:bg-primary-900 [&>option]:text-primary-50"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-primary-50 mb-2">
                Votre commentaire
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={3}
                placeholder="Partagez votre expérience..."
                className="w-full px-3 sm:px-4 py-2.5 text-sm bg-transparent border-2 border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400 text-primary-50 placeholder:text-primary-100/60"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-primary-50 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Ajouter une image (optionnel)
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="review-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <label
                  htmlFor="review-image-input"
                  className="cursor-pointer px-4 py-2 bg-primary-900/70 border-2 border-primary-700 rounded-lg text-sm text-primary-50 hover:bg-primary-800 transition"
                >
                  Choisir une image
                </label>
                {imageName && (
                  <span className="text-sm text-primary-100">{imageName}</span>
                )}
                {imagePreview && (
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 text-red-300 hover:bg-primary-900/60 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              {imagePreview && (
                <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setLightboxSrc(imagePreview)}>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Video Upload - DISABLED */}
            {/* Videos cause issues with large file sizes, disabled for now */}
            {/* Uncomment when needed:
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                <Video className="w-4 h-4 inline mr-2" />
                Ajouter une vidéo (optionnel)
              </label>
              ...
            </div>
            */}

            <Button type="submit" size="lg" isLoading={submitting} className="w-full bg-white/25 hover:bg-white/35 border border-white/30 text-white">
              Envoyer mon avis
            </Button>
          </form>
        </Card>

        {reviews.length === 0 ? (
        <Card className="p-8 text-center bg-primary-900/70 backdrop-blur-xl border border-primary-800">
            <p className="text-primary-50">Aucun avis pour le moment</p>
          </Card>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="overflow-hidden bg-primary-50/95 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow"
                >
                {/* Post Header */}
                <div className="p-3 sm:p-4 border-b border-gray-300/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {review.user?.name || 'Client anonyme'}
                      </h3>
                      <p className="text-xs text-gray-600">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-3 sm:p-4">
                  <p className="text-gray-800 text-xs sm:text-sm mb-3 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Image */}
                  {review.image && (
                    <div
                      className="mb-3 rounded-lg overflow-hidden bg-gray-200 max-h-80 w-full cursor-pointer"
                      onClick={() => setLightboxSrc(review.image || '')}
                    >
                      <img
                        src={review.image}
                        alt="Avis image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Post Footer */}
                <div className="px-3 sm:px-4 py-2 border-t border-gray-300/30">
                  <button
                    type="button"
                    onClick={() => handleHelpful(review.id)}
                    disabled={!!helpfulDisabled[review.id]}
                    aria-disabled={!!helpfulDisabled[review.id]}
                    className={`flex items-center gap-2 text-xs text-gray-700 transition-colors ${
                      helpfulDisabled[review.id] ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary-600'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Utile ({(review as any).helpful || 0})
                  </button>
                </div>
              </Card>
            ))}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setLightboxSrc('')}>
            <div className="relative max-w-3xl w-full p-4" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setLightboxSrc('')} className="absolute top-2 right-2 p-2 bg-white rounded-full">
                <X className="w-4 h-4" />
              </button>
              <div className="w-full rounded-lg overflow-hidden">
                <img src={lightboxSrc} alt="Lightbox" className="w-full h-auto max-h-[80vh] object-contain" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
