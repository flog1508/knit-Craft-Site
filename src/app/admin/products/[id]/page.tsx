'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth, useImageUpload } from '@/hooks'
import { Card, Button, Input } from '@/components/ui'
import { ImageDropZone } from '@/components/ImageDropZone'
import { Product } from '@/types'
import { ArrowLeft, Save, Trash2, ImagePlus } from 'lucide-react'
import Link from 'next/link'

export default function AdminProductEditPage() {
  const { isAdmin, isLoading } = useAuth()
  const { uploadImage, isUploading, error: uploadError } = useImageUpload()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const isNew = productId === 'new'

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [variants, setVariants] = useState<any[]>([])
  const [newVariant, setNewVariant] = useState({ name: '', daysMin: 7, daysMax: 10, priceMultiplier: 1.0 })
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    image: '',
    images: [] as string[],
    basePrice: 0,
    discountPercentage: 0,
    stock: 0,
    category: 'pullovers',
    isCustomizable: false,
    allowExact: true,
    allowCustom: true,
    allowBespoke: false,
    deliveryDaysMin: 7,
    deliveryDaysMax: 10,
  })

  // Chargement du produit existant une fois l'admin connecté
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAdmin && !isNew) {
      fetchProduct()
    }
  }, [isAdmin, productId, isNew]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`)
      const data = await response.json()
      if (data.data) {
        setProduct(data.data)
        setFormData({
          name: data.data.name,
          slug: data.data.slug,
          description: data.data.description,
          longDescription: data.data.longDescription || '',
          image: data.data.image,
          images: data.data.images || [],
          basePrice: data.data.price,
          discountPercentage: data.data.discountPercentage || 0,
          stock: data.data.stock || 0,
          category: data.data.category || 'pullovers',
          isCustomizable: data.data.isCustomizable || false,
          allowExact: true,
          allowCustom: true,
          allowBespoke: false,
          deliveryDaysMin: data.data.deliveryDaysMin || 7,
          deliveryDaysMax: data.data.deliveryDaysMax || 10,
        })
        
        // Fetch variants
        const varRes = await fetch(`/api/admin/products/${data.data.id}/variants`)
        const varData = await varRes.json()
        if (varData.success) {
          setVariants(varData.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) : value,
    }))
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ''],
    }))
  }

  const handleMainImageUpload = async (file: File) => {
    setUploadingIndex(-1)
    try {
      const url = await uploadImage(file)
      setFormData(prev => ({
        ...prev,
        image: url,
      }))
    } catch (error) {
      console.error('Erreur upload image principale:', error)
    } finally {
      setUploadingIndex(null)
    }
  }

  const handleAdditionalImageUpload = async (file: File, index: number) => {
    setUploadingIndex(index)
    try {
      const url = await uploadImage(file)
      setFormData(prev => ({
        ...prev,
        images: prev.images.map((img, i) => i === index ? url : img),
      }))
    } catch (error) {
      console.error('Erreur upload image additionnelle:', error)
    } finally {
      setUploadingIndex(null)
    }
  }

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img),
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addVariant = async () => {
    if (!product?.id || !newVariant.name) return
    
    try {
      const res = await fetch(`/api/admin/products/${product.id}/variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVariant),
      })
      
      const data = await res.json()
      if (data.success) {
        setVariants([...variants, data.data])
        setNewVariant({ name: '', daysMin: 7, daysMax: 10, priceMultiplier: 1.0 })
      }
    } catch (error) {
      console.error('Error adding variant:', error)
    }
  }

  const deleteVariant = async (variantId: string) => {
    if (!product?.id) return
    
    try {
      const res = await fetch(`/api/admin/products/${product.id}/variants/${variantId}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        setVariants(variants.filter(v => v.id !== variantId))
      }
    } catch (error) {
      console.error('Error deleting variant:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation basique
    if (!formData.name.trim()) {
      alert('Le nom du produit est obligatoire')
      return
    }
    if (!formData.slug.trim()) {
      alert('Le slug est obligatoire')
      return
    }
    if (!formData.description.trim()) {
      alert('La description courte est obligatoire')
      return
    }
    if (formData.basePrice <= 0) {
      alert('Le prix doit être supérieur à 0')
      return
    }

    setSaving(true)

    try {
      const method = isNew ? 'POST' : 'PUT'
      const endpoint = isNew ? '/api/admin/products' : `/api/admin/products/${productId}`

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert(isNew ? 'Produit créé avec succès!' : 'Produit mis à jour avec succès!')
        router.push('/admin/products')
      } else {
        const errorMsg = data.error || 'Erreur lors de la sauvegarde'
        console.error('Erreur API:', data)
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

  if (isLoading || (loading && !isNew)) {
    return <div className="p-8 text-center">Chargement...</div>
  }

  if (!isAdmin) {
    return <div className="p-8 text-center">Accès refusé</div>
  }

  return (
    <div className="min-h-screen py-10 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin/products">
          <button className="flex items-center gap-2 text-white/90 hover:text-white mb-6 sm:mb-8 transition">
            <ArrowLeft className="w-5 h-5" />
            Retour aux produits
          </button>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 drop-shadow">
          {isNew ? 'Nouveau produit' : `Modifier ${product?.name ?? ''}`}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 sm:p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Informations générales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Nom</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Pull à col roulé"
                  className="bg-white/15 border-white/30 placeholder-white/50 focus:ring-2 focus:ring-white/40 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Slug</label>
                <Input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="Ex: pull-col-roule"
                  className="bg-white/15 border-white/30 placeholder-white/50 focus:ring-2 focus:ring-white/40 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description courte</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description courte du produit"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/15 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 text-white placeholder-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description longue</label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  placeholder="Description détaillée du produit"
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white/15 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Catégorie</label>
                <select
                  name="category"
                  aria-label="Catégorie du produit"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/15 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 text-white appearance-none cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="pullovers">Pulls & Gilets</option>
                  <option value="accessories">Accessoires</option>
                  <option value="autres">Autres</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Images</h2>
            <div className="space-y-6">
              {/* Image principale */}
              <div>
                <ImageDropZone
                  label="Image principale"
                  preview={formData.image}
                  onImageSelected={handleMainImageUpload}
                  isLoading={uploadingIndex === -1 && isUploading}
                  alternativeText="Déposez l'image principale ici"
                />
                {uploadError && uploadingIndex === -1 && (
                  <p className="text-sm text-red-400 mt-2">{uploadError}</p>
                )}
              </div>

              {/* Images additionnelles */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">Images additionnelles</label>
                <div className="space-y-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <ImageDropZone
                            label={`Image ${index + 1}`}
                            preview={img}
                            onImageSelected={(file) => handleAdditionalImageUpload(file, index)}
                            isLoading={uploadingIndex === index && isUploading}
                            alternativeText="Déposez une image ou cliquez pour sélectionner"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="self-end p-2 hover:bg-red-600/20 rounded"
                          aria-label={`Supprimer l'image ${index + 1}`}
                        >
                          <Trash2 className="w-5 h-5 text-red-300" />
                        </button>
                      </div>
                      {uploadError && uploadingIndex === index && (
                        <p className="text-sm text-red-400">{uploadError}</p>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addImage}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium flex items-center gap-2"
                >
                  <ImagePlus className="w-4 h-4" />
                  Ajouter une image
                </button>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Prix & Stock</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Prix (FC)</label>
                <Input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  className="bg-white/15 border-white/30 focus:ring-2 focus:ring-white/40 rounded-lg"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Réduction (%)</label>
                <Input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  className="bg-white/15 border-white/30 focus:ring-2 focus:ring-white/40 rounded-lg"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Stock</label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="bg-white/15 border-white/30 focus:ring-2 focus:ring-white/40 rounded-lg"
                  min="0"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Délais de livraison/confection</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Délai minimum (jours)</label>
                <Input
                  type="number"
                  name="deliveryDaysMin"
                  value={formData.deliveryDaysMin}
                  onChange={handleChange}
                  className="bg-white/15 border-white/30 focus:ring-2 focus:ring-white/40 rounded-lg"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Délai maximum (jours)</label>
                <Input
                  type="number"
                  name="deliveryDaysMax"
                  value={formData.deliveryDaysMax}
                  onChange={handleChange}
                  className="bg-white/15 border-white/30 focus:ring-2 focus:ring-white/40 rounded-lg"
                  min="1"
                  required
                />
              </div>
            </div>
          </Card>

          {!isNew && product && (
            <Card className="p-6 sm:p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Options de livraison</h2>
              
              {/* Existing variants */}
              <div className="mb-6 space-y-2">
                {variants.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">{v.name}</p>
                      <p className="text-sm text-white/70">{v.daysMin}-{v.daysMax} jours {v.priceMultiplier > 1 && `(+${Math.round((v.priceMultiplier - 1) * 100)}%)`}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteVariant(v.id)}
                      className="p-2 hover:bg-red-600/20 rounded text-red-300"
                      aria-label={`Supprimer l'option ${v.name}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add new variant */}
              <div className="border-t border-white/20 pt-4 space-y-3">
                <p className="text-sm font-medium text-white">Ajouter une option</p>
                <Input
                  type="text"
                  placeholder="Ex: Express"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                  className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/40 rounded-lg"
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    placeholder="Jours min"
                    value={newVariant.daysMin}
                    onChange={(e) => setNewVariant({ ...newVariant, daysMin: parseInt(e.target.value) })}
                    className="bg-white/15 border-white/30 text-white focus:ring-2 focus:ring-white/40 rounded-lg"
                    min="1"
                  />
                  <Input
                    type="number"
                    placeholder="Jours max"
                    value={newVariant.daysMax}
                    onChange={(e) => setNewVariant({ ...newVariant, daysMax: parseInt(e.target.value) })}
                    className="bg-white/15 border-white/30 text-white focus:ring-2 focus:ring-white/40 rounded-lg"
                    min="1"
                  />
                  <Input
                    type="number"
                    placeholder="Multiplicateur"
                    value={newVariant.priceMultiplier}
                    onChange={(e) => setNewVariant({ ...newVariant, priceMultiplier: parseFloat(e.target.value) })}
                    className="bg-white/15 border-white/30 text-white focus:ring-2 focus:ring-white/40 rounded-lg"
                    step="0.1"
                    min="1"
                  />
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  + Ajouter
                </button>
              </div>
            </Card>
          )}

          <Card className="p-6 sm:p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Options de commande</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowExact"
                  checked={formData.allowExact}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-white">Exact (produit comme sur la photo)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowCustom"
                  checked={formData.allowCustom}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-white">Personnalisation (couleur, taille, etc)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowBespoke"
                  checked={formData.allowBespoke}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-white">Sur mesure / Commission</span>
              </label>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              isLoading={saving}
              className="flex items-center justify-center gap-2 flex-1"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
