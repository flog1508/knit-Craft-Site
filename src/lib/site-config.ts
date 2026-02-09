/**
 * Configuration centralisée du site (contact, etc.)
 * Utiliser les variables d'environnement ou les valeurs par défaut du footer.
 */
export const SITE_CONFIG = {
  phone: (process.env.NEXT_PUBLIC_CONTACT_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+243987352719').replace(/\s/g, ''),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.ADMIN_EMAIL || 'knitandcraft3@gmail.com',
}
