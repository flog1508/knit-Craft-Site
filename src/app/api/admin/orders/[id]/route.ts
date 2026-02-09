import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(
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

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
            customizations: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: order })
  } catch (error) {
    console.error('[ORDER_GET]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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
    const { status, estimatedDays } = body

    // Récupérer la commande et le variant pour validation
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Valider les jours estimés selon le variant
    if (order.variantId && estimatedDays) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: order.variantId },
      })

      if (variant && (estimatedDays < variant.daysMin || estimatedDays > variant.daysMax)) {
        return NextResponse.json(
          { error: `Les jours doivent être entre ${variant.daysMin} et ${variant.daysMax}` },
          { status: 400 }
        )
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: status || order.status,
        estimatedDays: estimatedDays || order.estimatedDays,
      },
    })

    // Si statut change à CONFIRMED, ajouter les revenus au total (statistiques)
    if ((status === 'CONFIRMED') && (order.status !== 'CONFIRMED')) {
      console.log(`Order ${order.orderNumber} confirmed, revenue: ${order.totalPrice}`)
      // Note: In a real app, you'd update a Revenue/Stats table here
    }

    return NextResponse.json({ data: updatedOrder })
  } catch (error) {
    console.error('[ORDER_PUT]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
