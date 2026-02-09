import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getImageUrl } from '@/lib/utils'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any

    if (!user?.role || (user.role as string).toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { customOptions: true, variants: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const mapped: any = {
      ...product,
      price: (product as any).basePrice,
      image: (product as any).image ? getImageUrl((product as any).image) : '/images/newsletter.jpg',
      images: ((product as any).images || []).map((img: string) => getImageUrl(img)),
    }

    return NextResponse.json({ success: true, data: mapped })
  } catch (error) {
    console.error('[ADMIN_PRODUCT_GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any

    if (!user?.role || (user.role as string).toUpperCase() !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()

    const updateData: Record<string, any> = {}
    if (body.name !== undefined) updateData.name = String(body.name)
    if (body.slug !== undefined) updateData.slug = String(body.slug)
    if (body.description !== undefined) updateData.description = String(body.description)
    if (body.longDescription !== undefined) updateData.longDescription = String(body.longDescription)
    if (body.images !== undefined) {
      const imgs = Array.isArray(body.images) ? body.images.filter((x: any) => x && String(x).trim()).map((x: any) => String(x)) : []
      updateData.images = imgs
    }
    if (body.basePrice !== undefined) updateData.basePrice = typeof body.basePrice === 'number' ? body.basePrice : parseFloat(body.basePrice) || 0
    if (body.discountPercentage !== undefined) updateData.discountPercentage = typeof body.discountPercentage === 'number' ? body.discountPercentage : parseInt(body.discountPercentage, 10) || 0
    if (body.stock !== undefined) updateData.stock = typeof body.stock === 'number' ? body.stock : parseInt(body.stock, 10) || 0
    if (body.category !== undefined) updateData.category = String(body.category)
    if (body.isCustomizable !== undefined) updateData.isCustomizable = Boolean(body.isCustomizable)
    if (body.allowExact !== undefined) updateData.allowExact = body.allowExact !== false
    if (body.allowCustom !== undefined) updateData.allowCustom = body.allowCustom !== false
    if (body.allowBespoke !== undefined) updateData.allowBespoke = Boolean(body.allowBespoke)
    if (body.deliveryDaysMin !== undefined) updateData.deliveryDaysMin = typeof body.deliveryDaysMin === 'number' ? body.deliveryDaysMin : parseInt(body.deliveryDaysMin, 10) || 7
    if (body.deliveryDaysMax !== undefined) updateData.deliveryDaysMax = typeof body.deliveryDaysMax === 'number' ? body.deliveryDaysMax : parseInt(body.deliveryDaysMax, 10) || 10
    if (body.image !== undefined) {
      const img = String(body.image || '').trim()
      updateData.image = img || '/images/newsletter.jpg'
    }

    let product
    try {
      product = await prisma.product.update({
        where: { id: params.id },
        data: updateData,
      })
    } catch (err: any) {
      const msg = String(err?.message || '')
      const isDeliveryDaysError = /deliveryDays(Min|Max)/i.test(msg) ||
        msg.includes('does not exist') ||
        msg.includes('Unknown column') ||
        msg.includes('current database')
      if (isDeliveryDaysError && (updateData.deliveryDaysMin !== undefined || updateData.deliveryDaysMax !== undefined)) {
        delete updateData.deliveryDaysMin
        delete updateData.deliveryDaysMax
        console.warn('[PRODUCT_PUT] retrying update without deliveryDays fields (DB schema mismatch)')
        product = await prisma.product.update({
          where: { id: params.id },
          data: updateData,
        })
      } else {
        throw err
      }
    }

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error('[PRODUCT_PUT]', error)
    const msg = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any

    if (!user?.role || (user.role as string).toUpperCase() !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const product = await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error('[PRODUCT_DELETE]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
