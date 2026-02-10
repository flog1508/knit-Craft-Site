'use client'

import React from 'react'
import { Product } from '@/types'
import { Badge, Card, Button } from '@/components/ui'
import { formatPrice, calculateDiscountedPrice, getImageUrl } from '@/lib/utils'
import ImageWithFallback from './ImageWithFallback'
import { ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onClick?: () => void
  onAddToCart?: () => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage)

  return (
    <Card
      hover
      className="overflow-hidden flex flex-col h-full bg-white/20 backdrop-blur-md border-0 shadow-lg"
      onClick={onClick}
    >
        {/* Image Container */}
        <div className="relative w-full h-64 mb-4 overflow-hidden rounded-md bg-gray-100">
          <ImageWithFallback
            src={getImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isOutOfStock && <Badge variant="danger">Rupture</Badge>}
            {product.discountPercentage > 0 && (
              <Badge variant="warning">{product.discountPercentage}%</Badge>
            )}
            {product.isCustomizable && <Badge variant="primary">Sur mesure</Badge>}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Category */}
          <p className="text-sm text-white/70 mb-3">{product.category}</p>

          {/* Description */}
          <p className="text-sm text-white/80 mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-white">{formatPrice(discountedPrice)}</span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-white/60 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Delivery Time */}
          <div className="text-xs text-white/70 mb-4">
            Livraison: {product.deliveryDaysMin || 7}-{product.deliveryDaysMax || 10} jours
          </div>

          {/* Add to cart */}
          <Button
            size="sm"
            className="mt-auto inline-flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart?.()
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Ajouter au panier
          </Button>
        </div>
      </Card>
  )
}
