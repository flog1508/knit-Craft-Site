import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderEmail, sendAdminNotification } from '@/lib/email'
import { generateWhatsAppLink, generateWhatsAppMessage } from '@/lib/whatsapp'
import { SITE_CONFIG } from '@/lib/site-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      totalPrice,
      contactMethod,
      items,
    } = body

    // Vérification des données requises
    if (!firstName || !lastName || !email || !phone || !address || !city) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Déterminer (ou créer) l'utilisateur invité à associer à la commande
    let userIdToUse: string
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        userIdToUse = existing.id
      } else {
        const guest = await prisma.user.create({
          data: {
            email,
            name: `${firstName} ${lastName}`,
            role: 'GUEST',
          },
        })
        userIdToUse = guest.id
      }
    } else {
      let guest = await prisma.user.findFirst({ where: { role: 'GUEST' } })
      if (!guest) {
        guest = await prisma.user.create({
          data: {
            email: `guest+${Date.now()}@knitandcraft.com`,
            name: 'Client invité',
            role: 'GUEST',
          },
        })
      }
      userIdToUse = guest.id
    }

    // Créer la commande
    const orderNumber = generateOrderNumber()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userIdToUse,
        email,
        phone,
        firstName,
        lastName,
        address,
        city,
        postalCode: '', // On n'a plus ce champ dans le formulaire
        country,
        totalPrice,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    })

    // Préparer les données pour les notifications
    const products = (items || []).map((it: any) => ({
      name: it.product?.name || it.name || 'Produit',
      quantity: it.quantity || 1,
      price: it.product?.price || it.price || 0,
    }))

    // Récupérer les délais du premier produit (ou utiliser une moyenne)
    const firstProduct = items?.[0]?.product
    const deliveryDays = firstProduct 
      ? { 
          min: firstProduct.deliveryDaysMin || 7, 
          max: firstProduct.deliveryDaysMax || 10 
        }
      : { min: 7, max: 10 }

    const notificationData = {
      orderNumber,
      clientName: `${firstName} ${lastName}`,
      clientEmail: email,
      clientPhone: phone,
      address: `${address}, ${city}${country ? ', ' + country : ''}`,
      totalPrice,
      products,
      orderType: 'CUSTOM',
      deliveryDays,
    }

    // Envoyer les notifications selon la méthode choisie
    // WhatsApp: lien vers le numéro de la boutique (footer), message pré-rempli pour le client
    if (contactMethod === 'whatsapp') {
      const message = generateWhatsAppMessage(notificationData)
      const merchantPhone = SITE_CONFIG.phone.replace(/\s/g, '')
      const whatsappLink = generateWhatsAppLink(merchantPhone, message)

      // Marquer la commande comme contact WhatsApp envoyé
      await prisma.order.update({
        where: { id: order.id },
        data: { whatsappSent: true },
      })

      // Envoyer aussi une notification à l'admin
      try {
        await sendAdminNotification({
          orderNumber,
          clientEmail: email,
          clientPhone: phone,
          clientName: `${firstName} ${lastName}`,
          products,
          totalPrice,
          orderType: notificationData.orderType || 'STANDARD',
        })
      } catch (err) {
        console.error('Erreur envoi email admin:', err)
      }

      return NextResponse.json({
        success: true,
        data: {
          order,
          whatsappLink,
        },
        message: 'Cliquez sur le lien WhatsApp pour confirmer votre commande',
      })
    } else if (contactMethod === 'email') {
      const emailResult = await sendOrderEmail(email, notificationData)
      if (!emailResult.ok) {
        return NextResponse.json(
          {
            success: false,
            error: emailResult.error || "L'email n'a pas pu être envoyé. Vérifiez la configuration SMTP (fichier .env).",
          },
          { status: 502 }
        )
      }

      try {
        await sendAdminNotification({
          orderNumber,
          clientEmail: email,
          clientPhone: phone,
          clientName: `${firstName} ${lastName}`,
          products,
          totalPrice,
          orderType: notificationData.orderType || 'STANDARD',
        })
      } catch (err) {
        console.error('Erreur envoi email admin:', err)
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { emailSent: true },
      })

      return NextResponse.json({
        success: true,
        data: { order },
        message: 'Email de confirmation envoyé.',
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
      },
    })
  } catch (error) {
    console.error('[CHECKOUT_POST]', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}
