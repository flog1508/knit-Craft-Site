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
      founders: [] as Founder[],
      values: [] as { title: string; description?: string }[],
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
      if (data) {
        setAbout(data)
        // Normalize founders: accept both `bio` and `description` coming from older data
        const ext = data.extendedData || {}
        if (ext.founders && Array.isArray(ext.founders)) {
          ext.founders = ext.founders.map((f: any) => ({
            name: f.name || '',
            role: f.role || '',
            description: f.description ?? f.bio ?? '',
            image: f.image || '',
          }))
        }

        setFormData({
          title: data.title,
          subtitle: data.subtitle || '',
          content: data.content,
          image: data.image || '',
          extendedData: {
            heroTitle: ext.heroTitle || '',
            heroSubtitle: ext.heroSubtitle || '',
            storyContent: ext.storyContent || '',
            founders: ext.founders || [],
            values: ext.values || [],
            teamContent: ext.teamContent || '',
            backgroundImage: ext.backgroundImage || '',
            foundersImage: ext.foundersImage || '',
          },
        })
      }
    } catch (error) {
      console.error('Erreur:', error)
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
          <h2 className="text-lg font-semibold text-white mb-3">Éléments supplémentaires (extended data)</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Notre histoire</label>
              <textarea rows={6} value={(formData.extendedData as any)?.storyContent || ''} onChange={(e) => {
                const v = e.target.value
                setFormData(prev => ({ ...prev, extendedData: { ...(prev as any).extendedData, storyContent: v } }))
              }} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Image des fondatrices</label>
              <ImageDropZone
                label="Founders image"
                preview={(formData.extendedData as any)?.foundersImage}
                onImageSelected={(file) => handleExtendedImageUpload(file, 'foundersImage')}
                isLoading={isUploading}
                alternativeText="Image des fondatrices"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Nos fondatrices</label>
              {((formData.extendedData as any)?.founders || []).map((f: Founder, idx: number) => (
                <div key={idx} className="mb-3 p-3 bg-white/10 rounded">
                  <input type="text" value={f.name || ''} placeholder="Nom" onChange={(e) => {
                    const v = e.target.value
                    setFormData(prev => {
                      const ext: any = { ...(prev as any).extendedData }
                      ext.founders = ext.founders || []
                      ext.founders[idx] = { ...(ext.founders[idx] || {}), name: v }
                      return { ...prev, extendedData: ext }
                    })
                  }} className="w-full mb-2 px-3 py-2 bg-white/20 rounded text-white" />
                  <input type="text" value={f.role || ''} placeholder="Rôle" onChange={(e) => {
                    const v = e.target.value
                    setFormData(prev => {
                      const ext: any = { ...(prev as any).extendedData }
                      ext.founders = ext.founders || []
                      ext.founders[idx] = { ...(ext.founders[idx] || {}), role: v }
                      return { ...prev, extendedData: ext }
                    })
                  }} className="w-full mb-2 px-3 py-2 bg-white/20 rounded text-white" />
                  <textarea rows={3} value={f.description || ''} placeholder="Description" onChange={(e) => {
                    const v = e.target.value
                    setFormData(prev => {
                      const ext: any = { ...(prev as any).extendedData }
                      ext.founders = ext.founders || []
                      ext.founders[idx] = { ...(ext.founders[idx] || {}), description: v }
                      return { ...prev, extendedData: ext }
                    })
                  }} className="w-full mb-2 px-3 py-2 bg-white/20 rounded text-white" />
                  <div className="mt-2">
                    <label className="block text-sm text-white mb-1">Image fondatrice</label>
                    <ImageDropZone label="Founder image" preview={f.image} onImageSelected={(file) => handleExtendedImageUpload(file, 'foundersImage', idx)} isLoading={isUploading} alternativeText="Image fondatrice" />
                  </div>
                  <button type="button" onClick={() => {
                    setFormData(prev => {
                      const ext: any = { ...(prev as any).extendedData }
                      ext.founders = (ext.founders || []).filter((_: any, i: number) => i !== idx)
                      return { ...prev, extendedData: ext }
                    })
                  }} className="mt-2 text-sm text-red-300">Supprimer</button>
                </div>
              ))}
              <button type="button" onClick={() => {
                setFormData(prev => {
                  const ext: any = { ...(prev as any).extendedData }
                  ext.founders = ext.founders || []
                  ext.founders.push({ name: '', role: '', bio: '', image: '' })
                  return { ...prev, extendedData: ext }
                })
              }} className="px-3 py-2 bg-white/20 rounded text-white">Ajouter une fondatrice</button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Valeurs (Qualité, Authenticité, Durabilité)</label>
              {((formData.extendedData as any)?.values || []).map((v: any, idx: number) => (
                <div key={idx} className="mb-2 flex gap-2">
                  <input type="text" value={v.title || ''} placeholder="Titre" onChange={(e) => {
                    const val = e.target.value
                    setFormData(prev => {
                      const ext: any = { ...(prev as any).extendedData }
                      ext.values = ext.values || []
                      ext.values[idx] = { ...(ext.values[idx] || {}), title: val }
                      return { ...prev, extendedData: ext }
                    })
                  }} className="flex-1 px-3 py-2 bg-white/20 rounded text-white" />
                  <input type="text" value={v.description || ''} placeholder="Description" onChange={(e) => {
                    const val = e.target.value
                    setFormData(prev => {
                      const ext: any = { ...(prev as any).extendedData }
                      ext.values = ext.values || []
                      ext.values[idx] = { ...(ext.values[idx] || {}), description: val }
                      return { ...prev, extendedData: ext }
                    })
                  }} className="flex-1 px-3 py-2 bg-white/20 rounded text-white" />
                  <button type="button" onClick={() => setFormData(prev => {
                    const ext: any = { ...(prev as any).extendedData }
                    ext.values = (ext.values || []).filter((_: any, i: number) => i !== idx)
                    return { ...prev, extendedData: ext }
                  })} className="text-red-300">Suppr</button>
                </div>
              ))}
              <button type="button" onClick={() => setFormData(prev => {
                const ext: any = { ...(prev as any).extendedData }
                ext.values = ext.values || []
                ext.values.push({ title: '', description: '' })
                return { ...prev, extendedData: ext }
              })} className="px-3 py-2 bg-white/20 rounded text-white">Ajouter une valeur</button>
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
          className="w-full bg-blue-600/80 hover:bg-blue-700/80 text-white px-8 py-3 rounded backdrop-blur-sm disabled:opacity-50 font-medium transition"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder les changements'}
        </button>
      </form>
    </div>
  )
}
