import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { productId: params.id },
      orderBy: { id: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: variants
    })
  } catch (error) {
    console.error('[VARIANTS_GET]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const variant = await prisma.productVariant.create({
      data: {
        productId: params.id,
        name: body.name,
        daysMin: body.daysMin,
        daysMax: body.daysMax,
        priceMultiplier: body.priceMultiplier || 1.0,
        description: body.description,
      }
    })

    return NextResponse.json({
      success: true,
      data: variant
    })
  } catch (error) {
    console.error('[VARIANTS_POST]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
