"use client"

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { getImageUrl } from '@/lib/utils'

type Props = Omit<ImageProps, 'src'> & {
  src: string
}

export const ImageWithFallback: React.FC<Props> = ({ src, alt, ...rest }) => {
  const [currentSrc, setCurrentSrc] = useState(src || '')

  return (
    <Image
      src={currentSrc || getImageUrl('')}
      alt={String(alt) || ''}
      onError={() => setCurrentSrc(getImageUrl(''))}
      {...(rest as any)}
    />
  )
}

export default ImageWithFallback
