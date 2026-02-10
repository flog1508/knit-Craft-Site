// Types pour les produits
export type Product = {
  id: string
  name: string
  slug: string
  description: string
  longDescription?: string
  image: string
  images: string[]
  price: number
  discountPercentage: number
  stock: number
  isOutOfStock: boolean
  category: string
  tags: string[]
  isCustomizable: boolean
  // Délais de livraison estimés (optionnels, suivant le schéma DB)
  deliveryDaysMin?: number
  deliveryDaysMax?: number
  createdAt: Date
  updatedAt: Date
}

export type CustomOption = {
  id: string
  productId: string
  name: string
  type: 'color' | 'size' | 'material' | 'text'
  values: string[]
  isRequired: boolean
}

// Types pour le panier
export type CartItem = {
  id: string
  cartId: string
  productId: string
  quantity: number
  customizations: CustomizationOption[]
  product?: Product
}

export type CustomizationOption = {
  id: string
  cartItemId: string
  optionName: string
  optionValue: string
}

// Types pour les commandes
export type Order = {
  id: string
  orderNumber: string
  userId: string
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
  items?: OrderItem[]
  totalPrice: number
  orderType?: 'EXACT' | 'CUSTOM' | 'BESPOKE'
  variantId?: string
  estimatedDays?: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  whatsappSent?: boolean
  emailSent?: boolean
  whatsappMessageId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  customizations: OrderCustomization[]
}

export type OrderCustomization = {
  id: string
  orderItemId: string
  optionName: string
  optionValue: string
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Types pour les avis
export type Review = {
  id: string
  productId: string
  userId: string
  rating: number
  comment: string
  isVerified: boolean
  helpful: number
  createdAt: Date
  updatedAt: Date
}

// Types pour l'utilisateur
export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  GUEST = 'GUEST',
}

export type UserWithRole = {
  id: string
  email?: string
  name?: string
  role: UserRole
}

// Types API
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginationParams = {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
