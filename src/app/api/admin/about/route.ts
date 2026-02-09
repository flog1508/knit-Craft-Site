import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Récupérer la page "À propos"
export async function GET() {
  try {
    const about = await prisma.about.findFirst()
    return NextResponse.json(about)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer la page "À propos"
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await req.json()
    
    await prisma.about.deleteMany()
    
    const about = await prisma.about.create({
      data: {
        title: String(data.title || 'À propos').trim(),
        subtitle: data.subtitle ? String(data.subtitle).trim() : null,
        content: String(data.content || '').trim() || ' ',
        image: data.image ? String(data.image).trim() : null,
        extendedData: data.extendedData ?? undefined,
      },
    })

    return NextResponse.json(about)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Mise à jour partielle : seuls les champs envoyés sont modifiés
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const about = await prisma.about.findFirst()
    
    if (!about) {
      return POST(req)
    }

    const updatePayload: Record<string, unknown> = {}
    if (data.title !== undefined && typeof data.title === 'string') {
      updatePayload.title = data.title.trim() || ' '
    }
    if (data.subtitle !== undefined) {
      updatePayload.subtitle = data.subtitle ? String(data.subtitle).trim() : null
    }
    if (data.content !== undefined && typeof data.content === 'string') {
      updatePayload.content = data.content.trim() || ' '
    }
    if (data.image !== undefined) {
      updatePayload.image = data.image ? String(data.image).trim() : null
    }
    if (data.extendedData !== undefined) {
      const existing = (about.extendedData as Record<string, unknown>) || {}
      const incoming = data.extendedData && typeof data.extendedData === 'object' ? data.extendedData as Record<string, unknown> : {}
      updatePayload.extendedData = { ...existing, ...incoming }
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(about)
    }

    const updated = await prisma.about.update({
      where: { id: about.id },
      data: updatePayload as any,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erreur PUT /api/admin/about:', error)
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
