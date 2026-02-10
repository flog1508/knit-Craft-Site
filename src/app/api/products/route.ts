import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '12')
    const category = searchParams.get('category')

    const where: any = {}
    if (category && category !== 'all') {
      where.category = category
    }

    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          customOptions: true,
        },
      }),
      prisma.product.count({ where }),
    ])

    // Map Prisma model basePrice -> price for frontend consistency and normalize image paths
    const products = rawProducts.map((p: any) => {
      const mapped: any = {
        ...p,
        price: (p as any).basePrice,
      }

      // Normalize single image
      mapped.image = (p as any).image ? getImageUrl((p as any).image) : '/images/newsletter.jpg'

      // Normalize images array if present
      if ((p as any).images) {
        mapped.images = (p as any).images.map((img: string) => getImageUrl(img))
      }

      return mapped
    })

    return NextResponse.json({
      success: true,
      data: products,
      total,
      skip,
      take,
    })
  } catch (error) {
    console.error('[PRODUCTS_GET]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        basePrice: body.basePrice || body.price || 0,
        image: body.image,
        category: body.category,
      },
      include: {
        customOptions: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('[PRODUCTS_POST]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
