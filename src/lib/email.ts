import nodemailer from 'nodemailer'
import { formatPrice } from './utils'

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

  // Fallback Gmail (EMAIL_* ou GMAIL_*)
  const gmailUser = process.env.EMAIL_USER || process.env.GMAIL_USER
  const gmailPass = process.env.EMAIL_PASSWORD || process.env.GMAIL_PASSWORD

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
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
    const hasSmtp = !!process.env.SMTP_HOST
    const hasGmail =
      !!process.env.EMAIL_USER ||
      !!process.env.GMAIL_USER

    if (!hasSmtp && !hasGmail) {
      console.error('Email: aucun SMTP ni compte Gmail configuré (.env)')
      return { ok: false, error: 'Configuration email manquante (SMTP_* ou EMAIL_USER/GMAIL_USER)' }
    }

    try {
      await transporter.verify()
    } catch (verifyErr: any) {
      const msg = verifyErr?.message || String(verifyErr)
      console.error('Email SMTP verify:', msg)
      return { ok: false, error: `Connexion SMTP impossible: ${msg}` }
    }

    const products = orderData.products || []
    const productList = products.map(p => `- ${p.name} x${p.quantity}: ${formatPrice(p.price * p.quantity)}`).join('\n')

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
                `<p style="margin: 5px 0;">• ${p.name} (x${p.quantity}) — ${formatPrice(p.price * p.quantity)}</p>`
            )
            .join('')}
        </div>
        
        <h3 style="color: #2c3e50; margin-top: 20px;">Total : ${formatPrice(orderData.totalPrice)}</h3>
        
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

Total : ${formatPrice(orderData.totalPrice)}

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
      
      <h3>Total: ${formatPrice(orderData.totalPrice)}</h3>
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

export async function sendReviewAdminEmail(payload: {
  name: string
  email: string
  message: string
  productId?: string
}) {
  try {
    const transporter = createTransporter()
    const hasSmtp = !!process.env.SMTP_HOST
    const hasGmail =
      !!process.env.EMAIL_USER ||
      !!process.env.GMAIL_USER

    if (!hasSmtp && !hasGmail) {
      console.error('Email avis: aucun SMTP ni compte Gmail configuré (.env)')
      return false
    }

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      (process.env.EMAIL_USER || process.env.GMAIL_USER || '')

    if (!adminEmail) {
      console.error('Email avis: aucune adresse admin configurée')
      return false
    }

    const html = `
      <h2>Nouvel avis client</h2>
      <p><strong>Nom:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email || 'Non fourni'}</p>
      ${payload.productId ? `<p><strong>Produit ID:</strong> ${payload.productId}</p>` : ''}
      <h3>Message</h3>
      <p>${payload.message}</p>
    `

    await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        `Knit & Craft <${process.env.GMAIL_USER || process.env.SMTP_USER || ''}>`,
      to: adminEmail,
      subject: '🧶 Nouvel avis client sur Knit & Craft',
      html,
    })

    console.log('Notification admin avis envoyée')
    return true
  } catch (error) {
    console.error('Erreur notification admin avis:', error)
    return false
  }
}

export async function sendBespokeClientEmail(payload: {
  to: string
  description: string
  requirements: string
  budget?: number
  deadline?: string
}) {
  try {
    const transporter = createTransporter()
    const hasSmtp = !!process.env.SMTP_HOST
    const hasGmail = !!process.env.EMAIL_USER || !!process.env.GMAIL_USER
    if (!hasSmtp && !hasGmail) return false

    try {
      await transporter.verify()
    } catch (e) {
      console.error('Email bespoke client verify:', e)
      return false
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
        <h2>Bonjour,</h2>
        <p>Nous avons bien reçu votre demande sur mesure. Voici un récapitulatif :</p>
        <div style="background:#f5f5f5;padding:14px;border-radius:8px;">
          <p><strong>Description :</strong><br/>${payload.description}</p>
          <p><strong>Exigences :</strong><br/>${payload.requirements}</p>
          <p><strong>Budget :</strong> ${payload.budget ? formatPrice(payload.budget) : 'Non spécifié'}</p>
          <p><strong>Délai :</strong> ${payload.deadline || 'Non spécifié'}</p>
        </div>
        <p style="margin-top:18px;">Nous vous recontacterons dès que possible.</p>
        <p><strong>Knit & Craft</strong></p>
      </div>
    `

    await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        `Knit & Craft <${process.env.GMAIL_USER || process.env.SMTP_USER || ''}>`,
      to: payload.to,
      subject: 'Confirmation de votre demande sur mesure',
      html,
    })
    console.log(`Email demande sur mesure envoyé à ${payload.to}`)
    return true
  } catch (e) {
    console.error('Erreur email bespoke client:', e)
    return false
  }
}

export async function sendBespokeAdminEmail(payload: {
  email: string
  description: string
  requirements: string
  budget?: number
  deadline?: string
}) {
  try {
    const transporter = createTransporter()
    const hasSmtp = !!process.env.SMTP_HOST
    const hasGmail = !!process.env.EMAIL_USER || !!process.env.GMAIL_USER
    if (!hasSmtp && !hasGmail) return false

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      (process.env.EMAIL_USER || process.env.GMAIL_USER || '')

    if (!adminEmail) return false

    const html = `
      <h2>Nouvelle demande sur mesure</h2>
      <p><strong>Email client:</strong> ${payload.email}</p>
      <p><strong>Description:</strong><br/>${payload.description}</p>
      <p><strong>Exigences:</strong><br/>${payload.requirements}</p>
      <p><strong>Budget:</strong> ${payload.budget ? formatPrice(payload.budget) : 'Non spécifié'}</p>
      <p><strong>Délai:</strong> ${payload.deadline || 'Non spécifié'}</p>
    `

    await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        `Knit & Craft <${process.env.GMAIL_USER || process.env.SMTP_USER || ''}>`,
      to: adminEmail,
      subject: '✨ Nouvelle demande sur mesure',
      html,
    })
    console.log('Notification admin demande sur mesure envoyée')
    return true
  } catch (e) {
    console.error('Erreur email bespoke admin:', e)
    return false
  }
}