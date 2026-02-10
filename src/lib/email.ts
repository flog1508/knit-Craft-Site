import nodemailer from 'nodemailer'

// Configuration SMTP ou Gmail
function createTransporter() {
  if (process.env.SMTP_HOST) {
    const port = parseInt(process.env.SMTP_PORT || '587', 10)
    const secure = process.env.SMTP_SECURE === 'true'
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  // Fallback Gmail (par défaut dans ton projet)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  })
}

export async function sendOrderEmail(
  to: string,
  orderData: {
    orderNumber: string
    clientName: string
    products: Array<{ name: string; quantity: number; price: number }>
    totalPrice: number
    deliveryDays?: { min: number; max: number }
  }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const transporter = createTransporter()

    // Vérifier que Gmail ou un SMTP est bien configuré
    if (!process.env.SMTP_HOST && !process.env.GMAIL_USER) {
      console.error('Email: aucun SMTP ni GMAIL_USER configuré (.env)')
      return { ok: false, error: 'Configuration email manquante (SMTP ou GMAIL_USER)' }
    }

    try {
      await transporter.verify()
    } catch (verifyErr: any) {
      const msg = verifyErr?.message || String(verifyErr)
      console.error('Email SMTP verify:', msg)
      return { ok: false, error: `Connexion SMTP impossible: ${msg}` }
    }

    const products = orderData.products || []
    const productList = products.map(p => `- ${p.name} x${p.quantity}: ${p.price}€`).join('\n')

    const firstName = orderData.clientName.split(' ')[0]

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const siteName = /localhost|127\.0\.0\.1|:3000/i.test(appUrl)
      ? 'Knit & Craft'
      : appUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'Knit & Craft'

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bonjour ${firstName},</h2>
        <p>Nous avons bien reçu votre commande. Voici le récapitulatif :</p>
        
        <h3 style="border-bottom: 2px solid #ddd; padding-bottom: 10px;">Commande #${orderData.orderNumber}</h3>
        
        <h4>Produits :</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${products
            .map(
              p =>
                `<p style="margin: 5px 0;">• ${p.name} (x${p.quantity}) — ${(p.price * p.quantity).toFixed(
                  2
                )}€</p>`
            )
            .join('')}
        </div>
        
        <h3 style="color: #2c3e50; margin-top: 20px;">Total : ${orderData.totalPrice}€</h3>
        
        ${
          orderData.deliveryDays
            ? `<p style="color: #27ae60; font-weight: bold;">Délai de livraison estimé : ${orderData.deliveryDays.min} à ${orderData.deliveryDays.max} jours.</p>`
            : '<p>Nous vous contacterons pour les détails de livraison.</p>'
        }
        
        <p style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          Votre commande sera traitée dès que possible. Nous vous recontacterons pour toute suite à donner.<br/>
          <strong style="color: #27ae60;">${siteName}</strong>
        </p>
      </div>
    `

    const text = `Bonjour ${firstName},

Nous avons bien reçu votre commande.

Commande #${orderData.orderNumber}

Produits :
${productList}

Total : ${orderData.totalPrice}€

${orderData.deliveryDays
  ? `Délai estimé : ${orderData.deliveryDays.min} à ${orderData.deliveryDays.max} jours.`
  : 'Nous vous contacterons pour les détails de livraison.'}

Votre commande sera traitée dès que possible.
${siteName}`

    await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        `Knit & Craft <${process.env.GMAIL_USER || process.env.SMTP_USER || ''}>`,
      to,
      subject: `Confirmation de commande #${orderData.orderNumber}`,
      html,
      text,
    })

    console.log(`Email envoyé à ${to}`)
    return { ok: true }
  } catch (error: any) {
    const msg = error?.message || String(error)
    console.error('Erreur envoi email:', msg)
    return { ok: false, error: msg }
  }
}

export async function sendAdminNotification(
  orderData: {
    orderNumber: string
    clientEmail: string
    clientPhone: string
    clientName: string
    products: Array<{ name: string; quantity: number }>
    totalPrice: number
    orderType: string
  }
) {
  try {
    const transporter = createTransporter()

    const products = orderData.products || []
    const productList = products.map(p => `- ${p.name} x${p.quantity}`).join('\n')

    const html = `
      <h2>Nouvelle commande #${orderData.orderNumber}</h2>
      <p><strong>Client:</strong> ${orderData.clientName}</p>
      <p><strong>Email:</strong> ${orderData.clientEmail}</p>
      <p><strong>Téléphone:</strong> ${orderData.clientPhone}</p>
      <p><strong>Type:</strong> ${orderData.orderType}</p>
      
      <h3>Produits:</h3>
      <pre>${productList}</pre>
      
      <h3>Total: ${orderData.totalPrice}$</h3>
    `

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
      process.env.GMAIL_USER ||
      'knitandcraft3@gmail.com'

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER || process.env.SMTP_USER,
      to: adminEmail,
      subject: `Nouvelle commande #${orderData.orderNumber}`,
      html,
    })

    console.log(`Notification admin envoyée`)
    return true
  } catch (error) {
    console.error('Erreur notification admin:', error)
    return false
  }
}

