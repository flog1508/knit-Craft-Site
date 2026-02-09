'use client'

import React, { useRef, useState } from 'react'
import { Upload, Trash2, ImagePlus } from 'lucide-react'

interface ImageDropZoneProps {
  onImageSelected: (file: File) => void
  preview?: string
  label?: string
  isLoading?: boolean
  alternativeText?: string
}

export const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  onImageSelected,
  preview,
  label = 'Image',
  isLoading = false,
  alternativeText = 'Glissez-déposez une image ici ou cliquez pour sélectionner',
}) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide')
      return false
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La taille de l\'image ne doit pas dépasser 5 MB')
      return false
    }
    setError('')
    return true
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        onImageSelected(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        onImageSelected(file)
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white mb-2">{label}</label>
      
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-400 bg-blue-500/20'
            : 'border-white/30 bg-white/5 hover:bg-white/10'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          accept="image/*"
          className="hidden"
          disabled={isLoading}
        />

        {preview ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-h-40 rounded-lg object-cover"
              />
            </div>
            <p className="text-sm text-white/70">Image sélectionnée</p>
            <p className="text-xs text-white/50">Cliquez ou glissez pour changer</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              {isLoading ? (
                <div className="animate-spin">
                  <Upload className="w-8 h-8 text-blue-300" />
                </div>
              ) : (
                <Upload className="w-8 h-8 text-white/60" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{alternativeText}</p>
              <p className="text-xs text-white/50 mt-1">PNG, JPG ou GIF (max 5 MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
