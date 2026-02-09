import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [totalOrders, totalProducts, allOrders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        where: { status: 'CONFIRMED' },
        include: { items: true },
      }),
    ])

    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0)

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalRevenue,
      },
    })
  } catch (error) {
    console.error('[ADMIN_STATS_GET]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
