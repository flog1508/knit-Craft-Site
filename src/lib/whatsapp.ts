/**
 * Utilitaire WhatsApp
 * Deux approches:
 * 1. Lien WhatsApp formaté (gratuit, simple)
 * 2. Twilio API (payant, automatisé)
 */

export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  // Nettoyer le numéro (enlever espaces, tirets, etc)
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  
  // Encoder le message
  const encodedMessage = encodeURIComponent(message)
  
  // Retourner le lien WhatsApp
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function generateWhatsAppMessage(
  orderData: {
    orderNumber: string
    clientName: string
    products: Array<{ name: string; quantity: number; price: number }>
    totalPrice: number
    orderType: string
    deliveryDays?: { min: number; max: number }
  }
): string {
  // Message du client vers la boutique (pre-rempli pour WhatsApp)
  const clientName = orderData.clientName.trim()
  let message = `Bonjour, je suis ${clientName}.\n\n`
  message += `J'ai commandé :\n\n`
  
  for (const product of orderData.products) {
    const lineTotal = (product.price || 0) * (product.quantity || 1)
    message += `• ${product.name} x${product.quantity} — ${lineTotal.toFixed(2)}€\n`
  }
  
  message += `\nTotal : ${orderData.totalPrice}€\n\n`
  message += `Merci de prendre ma commande en compte. Vous me répondrez quand vous aurez vu le message.`

  return message
}

// Configuration Twilio (optionnel, pour envois automatiques)
export async function sendWhatsAppViaTwilio(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️ Twilio non configuré. Utilisez le lien WhatsApp à la place.')
    return false
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER || 'whatsapp:+1234567890'

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: `whatsapp:${phoneNumber}`,
          Body: message,
        }).toString(),
      }
    )

    if (response.ok) {
      console.log('✅ Message WhatsApp envoyé via Twilio')
      return true
    } else {
      console.error('❌ Erreur Twilio:', await response.text())
      return false
    }
  } catch (error) {
    console.error('❌ Erreur WhatsApp:', error)
    return false
  }
}
