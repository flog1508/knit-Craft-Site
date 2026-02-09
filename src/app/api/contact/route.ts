import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    })

    // TODO: Envoyer un email de confirmation
    // const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/email/send`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     to: email,
    //     subject: 'Message reçu',
    //     template: 'contact-confirmation',
    //   }),
    // })

    return NextResponse.json({
      success: true,
      data: contactMessage,
    })
  } catch (error) {
    console.error('[CONTACT_POST]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
