import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBespokeAdminEmail, sendBespokeClientEmail } from '@/lib/email'

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

    // Emails (client + admin)
    const clientOk = await sendBespokeClientEmail({
      to: body.email,
      description: body.description,
      requirements: body.requirements,
      budget: body.budget,
      deadline: body.deadline,
    })

    // Admin notification non-bloquante
    sendBespokeAdminEmail({
      email: body.email,
      description: body.description,
      requirements: body.requirements,
      budget: body.budget,
      deadline: body.deadline,
    }).catch((e) => console.error('Erreur notification admin sur-mesure:', e))

    if (!clientOk) {
      return NextResponse.json(
        {
          success: false,
          error:
            "La demande est enregistrée, mais l'email de confirmation n'a pas pu être envoyé.",
          id: customOrder.id,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Demande reçue ! Nous vous contacterons bientôt.',
      id: customOrder.id,
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
