'use client'

import { useState, useEffect } from 'react'
import { useImageUpload } from '@/hooks'
import { ImageDropZone } from '@/components/ImageDropZone'

interface Founder {
  name: string
  role?: string
  description?: string
  image?: string
}

interface ExtendedData {
  heroTitle?: string
  heroSubtitle?: string
  storyContent?: string
  founders?: Founder[]
  values?: { title: string; description?: string }[]
  teamContent?: string
  backgroundImage?: string
  foundersImage?: string
}

interface AboutData {
  id: string
  title: string
  subtitle?: string
  content: string
  image?: string
  extendedData?: ExtendedData | null
}

const DEFAULT_FOUNDERS: Founder[] = [
  { name: 'Fondatrice 1', role: 'Co-fondatrice & designer', description: '' },
  { name: 'Fondatrice 2', role: 'Matières & qualité', description: '' },
  { name: 'Fondatrice 3', role: 'Vision & durabilité', description: '' },
]
const DEFAULT_VALUES = [
  { title: 'Créations uniques', description: '' },
  { title: 'Qualité & confort', description: '' },
  { title: 'Sur-mesure humain', description: '' },
]

export default function AdminAbout() {
  const { uploadImage, isUploading, error: uploadError } = useImageUpload()
  const [about, setAbout] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    image: '',
    extendedData: {
      heroTitle: '',
      heroSubtitle: '',
      storyContent: '',
      founders: DEFAULT_FOUNDERS.map(f => ({ ...f })),
      values: DEFAULT_VALUES.map(v => ({ ...v })),
      teamContent: '',
      backgroundImage: '',
      foundersImage: '',
    } as ExtendedData,
  })

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/admin/about')
      const data = await res.json()
      const ext = (data && data.extendedData) ? data.extendedData : {}
      if (data && !data.error) {
        setAbout(data)
      }
      // Toujours construire founders et values : si la base est vide ou pas de page À propos, on affiche les blocs par défaut
      let founders: Founder[] = []
      if (ext.founders && Array.isArray(ext.founders) && ext.founders.length > 0) {
        founders = ext.founders.map((f: any) => ({
          name: f.name || '',
          role: f.role || '',
          description: f.description ?? f.bio ?? '',
          image: f.image || '',
        }))
      } else {
        founders = DEFAULT_FOUNDERS.map(f => ({ ...f }))
      }
      let values = ext.values && Array.isArray(ext.values) && ext.values.length > 0
        ? ext.values
        : DEFAULT_VALUES.map(v => ({ ...v }))
      if (values.length < 3) {
        values = [...values, ...DEFAULT_VALUES.slice(values.length, 3).map(v => ({ ...v }))]
      }

      setFormData(prev => ({
        title: (data && !data.error && data.title) ? data.title : prev.title || '',
        subtitle: (data && !data.error && data.subtitle) ? data.subtitle : prev.subtitle || '',
        content: (data && !data.error && data.content) ? data.content : prev.content || '',
        image: (data && !data.error && data.image) ? data.image : prev.image || '',
        extendedData: {
          heroTitle: ext.heroTitle ?? prev.extendedData?.heroTitle ?? '',
          heroSubtitle: ext.heroSubtitle ?? prev.extendedData?.heroSubtitle ?? '',
          storyContent: ext.storyContent ?? prev.extendedData?.storyContent ?? '',
          founders,
          values,
          teamContent: ext.teamContent ?? prev.extendedData?.teamContent ?? '',
          backgroundImage: ext.backgroundImage ?? prev.extendedData?.backgroundImage ?? '',
          foundersImage: ext.foundersImage ?? prev.extendedData?.foundersImage ?? '',
        },
      }))
    } catch (error) {
      console.error('Erreur chargement À propos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file)
      setFormData(prev => ({
        ...prev,
        image: url,
      }))
    } catch (error) {
      console.error('Erreur upload image:', error)
    }
  }

  const handleExtendedImageUpload = async (file: File, key: 'backgroundImage' | 'foundersImage', idx?: number) => {
    try {
      const url = await uploadImage(file)
      setFormData(prev => {
        const ext: any = { ...(prev as any).extendedData }
        if (key === 'foundersImage' && typeof idx === 'number') {
          ext.founders = ext.founders || []
          ext.founders[idx] = { ...(ext.founders[idx] || {}), image: url }
        } else {
          ext[key] = url
        }
        return { ...prev, extendedData: ext }
      })
    } catch (error) {
      console.error('Erreur upload extended image:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Ensure server content field is set (keep compatibility)
      const payload: any = { ...formData }
      payload.content = (formData as any).content || ((formData as any).extendedData?.storyContent || '')

      const res = await fetch('/api/admin/about', {
        method: about ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      
      if (res.ok) {
        setAbout(data)
        alert('Changements sauvegardés avec succès!')
      } else {
        const errorMsg = data.error || 'Erreur lors de la sauvegarde'
        console.error('Erreur API:', errorMsg)
        alert(`Erreur: ${errorMsg}`)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Erreur:', error)
      alert(`Erreur lors de la sauvegarde: ${errorMsg}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-white">Chargement...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Éditer &quot;À propos&quot;</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-md rounded-lg p-8">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Titre</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/60"
            placeholder="Titre principal"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-white">Sous-titre</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/60"
            placeholder="Sous-titre (optionnel)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-white">Image de fond principale</label>
          <ImageDropZone
            label="Image de fond"
            preview={formData.image}
            onImageSelected={handleImageUpload}
            isLoading={isUploading}
            alternativeText="Déposez une image de fond ici"
          />
          {uploadError && (
            <p className="text-sm text-red-400 mt-2">{uploadError}</p>
          )}

          {/* backgroundImage uploader removed per admin request (avoid duplicate) */}
        </div>

        {/* The main story is editable below as 'Notre histoire' — content field hidden to simplify UI */}

        {/* Extended data editor */}
        <div className="pt-4 border-t border-white/20">
          <h2 className="text-lg font-semibold text-white mb-3">Contenu affiché sur la page À propos</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Notre histoire</label>
              <textarea rows={6} value={(formData.extendedData as any)?.storyContent || ''} onChange={(e) => {
                const v = e.target.value
                setFormData(prev => ({ ...prev, extendedData: { ...(prev as any).extendedData, storyContent: v } }))
              }} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Image des fondatrices (photo des trois ensemble)</label>
              <p className="text-sm text-white/70 mb-2">Photo de groupe affichée sur la page À propos. Vous pouvez la retirer si vous ajoutez des photos individuelles par fondatrice ci‑dessous.</p>
              <ImageDropZone
                label="Image des fondatrices"
                preview={(formData.extendedData as any)?.foundersImage}
                onImageSelected={(file) => handleExtendedImageUpload(file, 'foundersImage')}
                isLoading={isUploading}
                alternativeText="Déposez l'image des fondatrices"
              />
              {(formData.extendedData as any)?.foundersImage && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, extendedData: { ...(prev as any).extendedData, foundersImage: '' } }))}
                  className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
                >
                  Retirer cette image (photo des trois ensemble)
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Nos fondatrices</label>
              <p className="text-sm text-white/70 mb-3">Nom, rôle et description de chaque fondatrice (texte affiché sur la page À propos).</p>
              {((formData.extendedData as any)?.founders || []).map((f: Founder, idx: number) => (
                <div key={idx} className="mb-4 p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                  <input type="text" value={f.name || ''} placeholder="Nom de la fondatrice" onChange={(e) => {
                    const v = e.target.value
                    setFormData(prev => {
                      const ext: any = { ...(prev as any).extendedData }
                      ext.founders = ext.founders || []
                      ext.founders[idx] = { ...(ext.founders[idx] || {}), name: v }
                      return { ...prev, extendedData: ext }
                    })
                  }} className="w-full mb-2 px-3 py-2.5 bg-white/15 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/40" />
                  <input type="text" value={f.role || ''} placeholder="Rôle (ex : Co-fondatrice)" onChange={(e) => {
                    const v = e.target.value
                    setFormData(prev => {
                      const ext: any = { ...(prev as any).extendedData }
                      ext.founders = ext.founders || []
                      ext.founders[idx] = { ...(ext.founders[idx] || {}), role: v }
                      return { ...prev, extendedData: ext }
                    })
                  }} className="w-full mb-2 px-3 py-2.5 bg-white/15 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/40" />
                  <label className="block text-sm text-white/90 mt-2 mb-1">Description (affichée sur la page À propos)</label>
                  <textarea rows={4} value={(f.description ?? (f as any).bio ?? '') || ''} placeholder="Présentation de la fondatrice, parcours, valeurs..." onChange={(e) => {
                    const v = e.target.value
                    setFormData(prev => {
                      const ext: any = { ...(prev as any).extendedData }
                      ext.founders = ext.founders || []
                      ext.founders[idx] = { ...(ext.founders[idx] || {}), description: v }
                      return { ...prev, extendedData: ext }
                    })
                  }} className="w-full px-3 py-2.5 bg-white/15 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/40 resize-y" />
                  <div className="mt-3">
                    <label className="block text-sm text-white/90 mb-1">Photo de la fondatrice</label>
                    <ImageDropZone label="Photo" preview={f.image} onImageSelected={(file) => handleExtendedImageUpload(file, 'foundersImage', idx)} isLoading={isUploading} alternativeText="Image fondatrice" />
                  </div>
                  <button type="button" onClick={() => {
                    setFormData(prev => {
                      const ext: any = { ...(prev as any).extendedData }
                      ext.founders = (ext.founders || []).filter((_: any, i: number) => i !== idx)
                      return { ...prev, extendedData: ext }
                    })
                  }} className="mt-3 text-sm text-red-300 hover:text-red-200">Supprimer cette fondatrice</button>
                </div>
              ))}
              <button type="button" onClick={() => {
                setFormData(prev => {
                  const ext: any = { ...(prev as any).extendedData }
                  ext.founders = ext.founders || []
                  ext.founders.push({ name: '', role: '', description: '', image: '' })
                  return { ...prev, extendedData: ext }
                })
              }} className="px-4 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition">Ajouter une fondatrice</button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Les 3 valeurs affichées sur la page (Créations uniques, Qualité & confort, Sur-mesure humain)</label>
              <p className="text-sm text-white/70 mb-3">Modifiez le texte sous chaque titre sur la page À propos.</p>
              {((formData.extendedData as any)?.values || []).slice(0, 3).map((v: any, idx: number) => (
                <div key={idx} className="mb-4 p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                  <span className="block text-sm font-medium text-white/90 mb-2">
                    {v.title || (['Créations uniques', 'Qualité & confort', 'Sur-mesure humain'][idx])}
                  </span>
                  <textarea
                    rows={3}
                    value={v.description || ''}
                    placeholder="Texte affiché sous ce titre sur la page À propos"
                    onChange={(e) => {
                      const val = e.target.value
                      setFormData(prev => {
                        const ext: any = { ...(prev as any).extendedData }
                        ext.values = ext.values || []
                        ext.values[idx] = { ...(ext.values[idx] || {}), title: v.title || (['Créations uniques', 'Qualité & confort', 'Sur-mesure humain'][idx]), description: val }
                        return { ...prev, extendedData: ext }
                      })
                    }}
                    className="w-full px-3 py-2.5 bg-white/15 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/40"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Notre équipe</label>
              <textarea rows={4} value={(formData.extendedData as any)?.teamContent || ''} onChange={(e) => {
                const v = e.target.value
                setFormData(prev => ({ ...prev, extendedData: { ...(prev as any).extendedData, teamContent: v } }))
              }} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary-700/80 hover:bg-primary-800/80 text-white px-8 py-3 rounded backdrop-blur-sm disabled:opacity-50 font-medium transition"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder les changements'}
        </button>
      </form>
    </div>
  )
}
