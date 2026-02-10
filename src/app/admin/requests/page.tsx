'use client'

import { useEffect, useState } from 'react'
import { Sparkles, MessageCircle } from 'lucide-react'

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

  if (loading) return <div className="text-center py-8">Chargement des demandes...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
        <Sparkles className="w-7 h-7 text-accent-300" aria-hidden="true" />
        <span>Demandes Personnalisées (Sur Mesure)</span>
      </h1>

      {/* Filtres */}
      <div className="bg-white/20 backdrop-blur-md rounded-lg shadow p-6 mb-6">
        <p className="font-bold mb-3 text-white">Filtrer par statut:</p>
        <div className="flex flex-wrap gap-2">
          {['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded font-bold transition ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
        <p className="text-white/80 mt-4">
          {filteredRequests.length} demande(s)
        </p>
      </div>

      {/* Liste des demandes */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow p-8 text-center">
          <p className="text-white/80">Aucune demande pour ce filtre</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <div key={request.id} className="bg-white/20 backdrop-blur-md rounded-lg shadow p-6">
              {/* Entête */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Email et date */}
                <div>
                  <p className="text-white/70 text-sm">Email Client</p>
                  <p className="text-blue-300 underline cursor-pointer">
                    <a href={`mailto:${request.email}`}>{request.email}</a>
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                {/* Budget et deadline */}
                <div>
                  <p className="text-white/70 text-sm">Budget</p>
                  <p className="font-bold text-green-300">
                    {request.budget ? `${request.budget}€` : 'Non spécifié'}
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    Deadline: {request.deadline 
                      ? new Date(request.deadline).toLocaleDateString('fr-FR')
                      : 'Aucune'
                    }
                  </p>
                </div>

                {/* Status badge */}
                <div className="flex items-center justify-end">
                  <span className="text-2xl">{getStatusLabel(request.status)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/10 p-4 rounded mb-4">
                <p className="text-white/70 text-sm mb-1">Description:</p>
                <p className="text-white">{request.description}</p>
                
                <p className="text-white/70 text-sm mt-3 mb-1">Exigences:</p>
                <p className="text-white">{request.requirements}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateRequestStatus(request.id, status)}
                    className={`px-4 py-2 rounded font-bold transition ${
                      request.status === status
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>

              {/* Bouton contact rapide */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <a
                  href={`https://wa.me/${(process.env.NEXT_PUBLIC_CONTACT_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '243987352719').replace(/\D/g, '')}?text=Bonjour, concernant votre demande personnalisée de ${request.email}...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  <span>Contacter via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
