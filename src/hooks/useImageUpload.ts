import { useState } from 'react'

interface UseImageUploadResult {
  uploadImage: (file: File) => Promise<string>
  isUploading: boolean
  error: string | null
}

export const useImageUpload = (): UseImageUploadResult => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true)
    setError(null)

    try {
      const reader = new FileReader()
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const base64Data = e.target?.result as string
            
            const response = await fetch('/api/uploads', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                filename: file.name,
                data: base64Data,
              }),
            })

            if (!response.ok) {
              throw new Error('Erreur lors de l\'upload')
            }

            const data = await response.json()
            
            if (data.success && data.url) {
              setIsUploading(false)
              resolve(data.url)
            } else {
              throw new Error(data.error || 'Erreur lors de l\'upload')
            }
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue'
            setError(errorMsg)
            setIsUploading(false)
            reject(err)
          }
        }

        reader.onerror = () => {
          const errorMsg = 'Erreur lors de la lecture du fichier'
          setError(errorMsg)
          setIsUploading(false)
          reject(new Error(errorMsg))
        }

        reader.readAsDataURL(file)
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMsg)
      setIsUploading(false)
      throw err
    }
  }

  return {
    uploadImage,
    isUploading,
    error,
  }
}
