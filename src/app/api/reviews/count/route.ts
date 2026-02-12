import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId')

    if (productId) {
      const count = await prisma.review.count({ where: { productId } })
      return NextResponse.json({ success: true, data: { count } })
    }

    const total = await prisma.review.count()
    return NextResponse.json({ success: true, data: { count: total } })
  } catch (error) {
    console.error('[REVIEWS_COUNT_GET]', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
