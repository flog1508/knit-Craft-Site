import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing review id' }, { status: 400 })
    }

    // simple abuse protection using a cookie that stores voted review ids
    try {
      const existing = request.cookies.get('helpful_voted')?.value
      const arr: string[] = existing ? JSON.parse(existing) : []
      if (arr.includes(id)) {
        return NextResponse.json({ success: false, error: 'Already voted' }, { status: 429 })
      }

      const updated = await prisma.review.update({
        where: { id },
        data: { helpful: { increment: 1 } },
      })

      // append id to cookie list
      arr.push(id)
      const res = NextResponse.json({ success: true, data: { id: updated.id, helpful: updated.helpful } })
      // set cookie for ~1 year
      res.cookies.set('helpful_voted', JSON.stringify(arr), { maxAge: 60 * 60 * 24 * 365, path: '/', httpOnly: false })
      return res
    } catch (err) {
      console.error('[REVIEWS_HELPFUL] cookie/error', err)
      return NextResponse.json({ success: false, error: 'Internal' }, { status: 500 })
    }
  } catch (error) {
    console.error('[REVIEWS_HELPFUL]', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown' }, { status: 500 })
  }
}
