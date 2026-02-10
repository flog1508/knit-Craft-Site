import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendReviewAdminEmail } from '@/lib/email'

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    const data = reviews.map((r) => ({
      id: r.id,
      name: r.user?.name || 'Client Knit & Craft',
      message: r.comment,
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Erreur GET /api/reviews:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, rating, comment, message, name, email, image, video } = body || {}
    const text = (typeof comment === 'string' && comment.trim())
      ? comment.trim()
      : (typeof message === 'string' ? message.trim() : '')

    if (!text) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    const safeEmail =
      (typeof email === 'string' && email.trim()) ||
      `guest+${Date.now()}@knitandcraft.com`
    const displayName =
      (typeof name === 'string' && name.trim()) || 'Client invité'

    let user = await prisma.user.findFirst({
      where: { email: safeEmail },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: safeEmail,
          name: displayName,
          role: 'GUEST',
        },
      })
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: productId || null,
        rating: Math.min(5, Math.max(1, typeof rating === 'number' ? rating : 5)),
        comment: text,
        image: image || null,
        video: video || null,
        isVerified: !!productId,
      },
      include: {
        user: { select: { name: true } },
      },
    })

    // Notification admin (non bloquante)
    try {
      await sendReviewAdminEmail({
        name: displayName,
        email: safeEmail,
        message: text,
        productId: productId || undefined,
      })
    } catch (e) {
      console.error('Erreur notification email avis:', e)
    }

    return NextResponse.json({
      success: true,
      data: {
        id: review.id,
        name: review.user?.name || displayName,
        message: review.comment,
      },
    })
  } catch (error) {
    console.error('Erreur POST /api/reviews:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
