import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        customOptions: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Ensure price is present for frontend and normalize image paths
    const mapped: any = {
      ...product,
      price: (product as any).basePrice,
    }

    if (product.image) {
      let url = getImageUrl(product.image)
      try {
        if (url.startsWith('/')) {
          const publicPath = path.join(process.cwd(), 'public', decodeURIComponent(url))
          if (!fs.existsSync(publicPath)) {
            const base = path.basename(url)
            const altPath = path.join(process.cwd(), 'public', 'images', base)
            if (fs.existsSync(altPath)) {
              url = '/images/' + encodeURIComponent(base)
            }
          }
        }
      } catch (e) {}
      mapped.image = url
    } else {
      mapped.image = '/images/newsletter.jpg'
    }

    if ((product as any).images) {
      mapped.images = (product as any).images.map((img: string) => getImageUrl(img))
    }

    return NextResponse.json({
      success: true,
      data: mapped,
    })
  } catch (error) {
    console.error('[PRODUCT_GET]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()

    const product = await prisma.product.update({
      where: { slug: params.slug },
      data: body,
      include: {
        customOptions: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('[PRODUCT_PUT]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
