import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getImageUrl } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any

    if (!user?.role || (user.role as string).toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const take = parseInt(searchParams.get('take') || '100')
    const skip = parseInt(searchParams.get('skip') || '0')

    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        include: { customOptions: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ])

    const products = rawProducts.map((p: any) => ({
      ...p,
      price: (p as any).basePrice,
      image: (p as any).image ? getImageUrl((p as any).image) : '/images/newsletter.jpg',
      images: ((p as any).images || []).map((img: string) => getImageUrl(img)),
    }))

    return NextResponse.json({ success: true, data: products, total })
  } catch (error) {
    console.error('[ADMIN_PRODUCTS_GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    const image = body.image && String(body.image).trim() ? String(body.image) : null
    const images = Array.isArray(body.images) ? body.images.filter((x: any) => String(x).trim()).map((x: any) => String(x)) : []

    const basePrice = typeof body.basePrice === 'number' ? body.basePrice : parseFloat(body.basePrice) || 0
    const discountPercentage = typeof body.discountPercentage === 'number' ? body.discountPercentage : parseInt(body.discountPercentage, 10) || 0
    const stock = typeof body.stock === 'number' ? body.stock : parseInt(body.stock, 10) || 0

    const name = String(body.name || '').trim()
    const rawSlug = String(body.slug || '').trim()
    const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'produit'
    let slug = rawSlug ? slugify(rawSlug) : slugify(name)
    if (!slug) slug = 'produit'
    let slugCandidate = slug
    let attempt = 0
    while (true) {
      const existing = await prisma.product.findUnique({ where: { slug: slugCandidate } })
      if (!existing) break
      attempt += 1
      slugCandidate = `${slug}-${attempt}`
    }
    slug = slugCandidate

    const createData: any = {
      name: name || 'Sans nom',
      slug,
      description: String(body.description || ''),
      longDescription: String(body.longDescription || ''),
      image: image || '',
      images,
      basePrice,
      discountPercentage,
      stock,
      category: String(body.category || 'pullovers'),
      tags: [],
      isCustomizable: Boolean(body.isCustomizable),
      allowExact: body.allowExact !== false,
      allowCustom: body.allowCustom !== false,
      allowBespoke: Boolean(body.allowBespoke),
      deliveryDaysMin: typeof body.deliveryDaysMin === 'number' ? body.deliveryDaysMin : parseInt(body.deliveryDaysMin, 10) || 7,
      deliveryDaysMax: typeof body.deliveryDaysMax === 'number' ? body.deliveryDaysMax : parseInt(body.deliveryDaysMax, 10) || 10,
    }

    let product
    try {
      product = await prisma.product.create({ data: createData })
    } catch (err: any) {
      const msg = String(err?.message || '')
      const isDeliveryDaysError = /deliveryDays(Min|Max)/i.test(msg) ||
        msg.includes('does not exist') ||
        msg.includes('Unknown column') ||
        msg.includes('current database')
      if (isDeliveryDaysError) {
        delete createData.deliveryDaysMin
        delete createData.deliveryDaysMax
        console.warn('[PRODUCT_POST] retrying create without deliveryDays fields (DB schema mismatch)')
        product = await prisma.product.create({ data: createData })
      } else {
        throw err
      }
    }

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error('[PRODUCT_POST]', error)
    const msg = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
