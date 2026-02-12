// Utilitaires pour les prix et conversions (Franc congolais - CDF)
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'CDF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const calculateDiscountedPrice = (price: number, discountPercentage: number): number => {
  if (discountPercentage <= 0) return price
  return price - (price * discountPercentage) / 100
}

export const calculateOrderTotal = (items: any[]): number => {
  return items.reduce((total, item) => {
    const itemPrice = item.product?.price || item.price || 0
    return total + itemPrice * item.quantity
  }, 0)
}

// Utilitaires pour les URLs
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Utilitaires pour les images
export const getImageUrl = (image: string): string => {
  // Default fallback
  if (!image || image.trim() === '') {
    return '/images/newsletter.jpg'
  }

  // Remote URLs - pass through unchanged
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  // Normalize: convert backslashes to forward slashes
  let normalized = image.replace(/\\/g, '/')

  // Extract the public path part
  // If it contains /public/, use everything after that
  const publicIdx = normalized.lastIndexOf('/public/')
  if (publicIdx !== -1) {
    normalized = normalized.substring(publicIdx + '/public'.length)
  } else if (normalized.match(/^[a-zA-Z]:/)) {
    // Windows absolute path (C:\...) - extract just the filename
    const parts = normalized.split('/')
    normalized = '/' + (parts[parts.length - 1] || 'newsletter.jpg')
  }

  // Ensure it starts with /
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized
  }

  // If path doesn't contain /images/, add it
  if (!normalized.includes('/images/')) {
    const filename = normalized.split('/').pop() || 'newsletter.jpg'
    normalized = '/images/' + filename
  }

  return normalized
}

// Utilitaires pour les numéros de commande
export const generateOrderNumber = (): string => {
  const prefix = 'ORD'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `${prefix}${timestamp}${random}`
}

// Utilitaires pour WhatsApp
export const formatWhatsAppMessage = (
  customerName: string,
  items: any[],
  totalPrice: number,
  customizations?: Record<string, string>
): string => {
  let message = `*Nouvelle Commande - Knit & Craft*\n\n`
  message += `*Client:* ${customerName}\n`
  message += `*Produits:*\n`

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.product?.name || item.name} x${item.quantity}\n`
    if (item.customizations && item.customizations.length > 0) {
      item.customizations.forEach((custom: any) => {
        message += `   - ${custom.optionName}: ${custom.optionValue}\n`
      })
    }
  })

  message += `\n*Montant Total:* ${formatPrice(totalPrice)}\n`
  message += `\n_Créée via Knit & Craft_`

  return encodeURIComponent(message)
}

export const getWhatsAppLink = (phoneNumber: string, message: string): string => {
  return `https://wa.me/${phoneNumber}?text=${message}`
}

// Validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  // Format: +212 ou 0 suivi de 9 chiffres
  const phoneRegex = /^(?:\+212|0)[567]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Utilitaires de temps
export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatDateTime = (date: Date | string): string => {
  return new Intl.DateTimeFormat('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
