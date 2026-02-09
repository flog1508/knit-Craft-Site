import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    await prisma.productVariant.delete({
      where: { id: params.variantId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[VARIANT_DELETE]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
