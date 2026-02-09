import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { productId, rating, comment, name, email, image, video } = body

    // For guest reviews (no productId needed)
    if (!session?.user?.id) {
      let guestUser = await prisma.user.findFirst({ 
        where: { email: email || `guest+${Date.now()}@knitandcraft.com` } 
      })
      
      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            email: email || `guest+${Date.now()}@knitandcraft.com`,
            name: name || 'Client invité',
            role: 'GUEST',
          },
        })
      }

      const reviewData: any = {
        userId: guestUser.id,
        rating: Math.min(5, Math.max(1, rating || 5)),
        comment,
        image: image || null,
        video: video || null,
        isVerified: false,
      }

      if (productId) {
        reviewData.productId = productId
      }

      const review = await prisma.review.create({
        data: reviewData,
        include: { 
          user: { 
            select: { id: true, name: true, image: true } 
          } 
        },
      })

      return NextResponse.json({ success: true, data: review })
    }

    // If logged in and productId provided: verify purchase
    if (productId) {
      const orderItem = await prisma.orderItem.findFirst({
        where: {
          productId,
          order: { userId: session.user.id },
        },
      })

      if (!orderItem) {
        return NextResponse.json(
          { success: false, error: 'You must purchase this product to review it' },
          { status: 403 }
        )
      }
    }

    // Create verified review for logged-in users
    const reviewData: any = {
      userId: session.user.id,
      rating: Math.min(5, Math.max(1, rating || 5)),
      comment,
      image: image || null,
      video: video || null,
      isVerified: !!productId,
    }

    if (productId) {
      reviewData.productId = productId
    }

    const review = await prisma.review.create({
      data: reviewData,
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    console.error('[REVIEWS_POST]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
