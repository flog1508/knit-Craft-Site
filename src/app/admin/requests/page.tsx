'use client'

import { useEffect, useState } from 'react'
import { Sparkles, MessageCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface CustomRequest {
  id: string
  email: string
  description: string
  requirements: string
  budget?: number
  deadline?: string
  status: string
  createdAt: string
}

export default function AdminRequests() {
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('PENDING')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/bespoke')
      const data = await res.json()
      setRequests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bespoke/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (res.ok) {
        fetchRequests()
        alert('Demande mise à jour !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const filteredRequests = requests.filter(r => r.status === filter)

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente'
      case 'ACCEPTED': return 'Acceptée'
      case 'IN_PROGRESS': return 'En cours'
      case 'COMPLETED': return 'Terminée'
      case 'REJECTED': return 'Rejetée'
      default: return status
    }
  }

  if (loading) return <div className="text-center py-8 text-accent-100">Chargement des demandes...</div>

  return (
    <div className="py-10 sm:py-12 space-y-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent-400/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-accent-300" aria-hidden="true" />
        </div>
        <div>
          <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-1">Sur mesure</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-50">
            Demandes personnalisées
          </h1>
          <p className="text-accent-100 text-sm mt-1">
            Gérez les demandes de création sur mesure envoyées par vos clients.
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 shadow-lg shadow-primary-900/40">
        <p className="font-bold mb-3 text-primary-50">Filtrer par statut</p>
        <div className="flex flex-wrap gap-2">
          {['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                filter === status
                  ? 'bg-accent-400/90 text-primary-950'
                  : 'bg-primary-800/50 text-accent-100 hover:bg-primary-800 border border-primary-700'
              }`}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
        <p className="text-accent-100 mt-4">
          <span className="font-semibold text-primary-50">{filteredRequests.length}</span> demande(s)
        </p>
      </div>

      {/* Liste des demandes */}
      {filteredRequests.length === 0 ? (
        <div className="bg-primary-900/70 border border-primary-800 rounded-2xl shadow-lg shadow-primary-900/40 p-8 text-center">
          <p className="text-accent-100">Aucune demande pour ce filtre.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map(request => (
            <div key={request.id} className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 shadow-lg shadow-primary-900/40">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-accent-200 text-sm font-medium mb-1">Email client</p>
                  <a href={`mailto:${request.email}`} className="text-accent-300 hover:text-accent-200 underline break-all">
                    {request.email}
                  </a>
                  <p className="text-accent-100 text-sm mt-2">
                    {new Date(request.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-accent-200 text-sm font-medium mb-1">Budget</p>
                  <p className="font-bold text-primary-50">
                    {request.budget ? formatPrice(request.budget) : 'Non spécifié'}
                  </p>
                  <p className="text-accent-100 text-sm mt-2">
                    Souhaité pour le {request.deadline ? new Date(request.deadline).toLocaleDateString('fr-FR') : '—'}
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  <span className="inline-block px-3 py-1.5 rounded-lg font-semibold text-sm bg-primary-800/80 text-primary-50 border border-primary-700">
                    {getStatusLabel(request.status)}
                  </span>
                </div>
              </div>

              <div className="bg-primary-800/50 p-4 rounded-xl border border-primary-800 mb-4 space-y-3">
                <div>
                  <p className="text-accent-200 text-sm font-medium mb-1">Description</p>
                  <p className="text-primary-50 whitespace-pre-wrap">{request.description}</p>
                </div>
                <div>
                  <p className="text-accent-200 text-sm font-medium mb-1">Exigences</p>
                  <p className="text-primary-50 whitespace-pre-wrap">{request.requirements || '—'}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateRequestStatus(request.id, status)}
                    className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                      request.status === status
                        ? 'bg-accent-400/90 text-primary-950'
                        : 'bg-primary-800/50 text-accent-100 hover:bg-primary-800 border border-primary-700'
                    }`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-primary-800">
                <a
                  href={`https://wa.me/${(process.env.NEXT_PUBLIC_CONTACT_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '243987352719').replace(/\D/g, '')}?text=Bonjour, concernant votre demande personnalisée (${request.email})...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-primary-50 px-4 py-2.5 rounded-lg font-bold hover:bg-green-500 inline-flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  Contacter via WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
