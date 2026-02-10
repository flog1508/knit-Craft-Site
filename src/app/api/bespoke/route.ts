import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface BespokeRequest {
  userId?: string
  email: string
  description: string
  requirements: string
  budget?: number
  deadline?: string
  images?: string[]
}

export async function POST(req: NextRequest) {
  try {
    const body: BespokeRequest = await req.json()

    // Créer ou récupérer un utilisateur invité pour les commandes non connectées
    let userId = body.userId
    if (!userId && body.email) {
      const existing = await prisma.user.findUnique({ where: { email: body.email } })
      if (existing) {
        userId = existing.id
      } else {
        const guest = await prisma.user.create({
          data: {
            email: body.email,
            name: body.email.split('@')[0],
            role: 'GUEST',
          },
        })
        userId = guest.id
      }
    }
    if (!userId) {
      const anyGuest = await prisma.user.findFirst({ where: { role: 'GUEST' } })
      userId = anyGuest?.id || (await prisma.user.create({
        data: { email: `guest+${Date.now()}@knitandcraft.com`, name: 'Guest', role: 'GUEST' },
      })).id
    }

    const customOrder = await prisma.customOrder.create({
      data: {
        userId,
        email: body.email,
        description: body.description,
        requirements: body.requirements,
        budget: body.budget,
        deadline: body.deadline ? new Date(body.deadline) : null,
        images: body.images ?? [],
        status: 'PENDING',
      },
    })

    // Notifier l'admin
    const message =
      `Nouvelle demande personnalisée\n\n` +
      `Email: ${body.email}\n` +
      `Description: ${body.description}\n` +
      `Budget: ${body.budget ? body.budget + '€' : 'Non spécifié'}\n` +
      `Délai: ${body.deadline || 'Non spécifié'}`
    
    console.log('Admin notification:', message)

    return NextResponse.json({
      success: true,
      message: 'Demande reçue ! Nous vous contacterons bientôt.',
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la demande' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const customOrders = await prisma.customOrder.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(customOrders)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
