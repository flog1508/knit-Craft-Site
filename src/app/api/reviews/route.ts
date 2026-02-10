import { NextRequest, NextResponse } from 'next/server'
import { put, get } from '@vercel/blob'

const BLOB_NAME = 'reviews.json'

interface Review {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

async function readReviewsFromBlob(): Promise<Review[]> {
  try {
    const blob = await get(BLOB_NAME)
    if (!blob || !blob.url) {
      return []
    }

    const res = await fetch(blob.url)
    if (!res.ok) return []

    const data = (await res.json()) as Review[] | undefined
    if (!Array.isArray(data)) return []
    return data
  } catch {
    // Au premier appel le blob peut ne pas exister
    return []
  }
}

export async function GET() {
  const data = await readReviewsFromBlob()
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body || typeof body.message !== 'string' || !body.message.trim()) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Client Knit & Craft'
    const email = typeof body.email === 'string' ? body.email.trim() : ''

    const existing = await readReviewsFromBlob()

    const review: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      message: body.message.trim(),
      createdAt: new Date().toISOString(),
    }

    const updated = [review, ...existing]

    await put(BLOB_NAME, JSON.stringify(updated, null, 2), {
      contentType: 'application/json',
      access: 'public',
    })

    return NextResponse.json({ success: true, data: review })
  } catch (error) {
    console.error('Erreur POST /api/reviews:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
