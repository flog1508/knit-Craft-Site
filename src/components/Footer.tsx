'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Mail, Phone } from 'lucide-react'

const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+243 987 352 719'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'knitandcraft3@gmail.com'

const WHATSAPP_MSG = encodeURIComponent(
  'Bonjour, je souhaite passer une commande sur Knit & Craft. Pouvez-vous me recontacter ?'
)
const MAILTO_SUBJECT = encodeURIComponent('Demande de commande - Knit & Craft')
const MAILTO_BODY = encodeURIComponent(
  'Bonjour,\n\nJe souhaite passer une commande sur Knit & Craft.\n\nMerci de me recontacter.\n\nCordialement'
)

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-primary-50 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/WhatsApp Image 2026-02-01 at 22.50.19.jpeg"
                alt="Knit & Craft Logo"
                width={50}
                height={50}
                className="object-cover rounded"
              />
              <span className="font-bold text-lg text-accent-300">Knit & Craft</span>
            </div>
            <p className="text-accent-100 text-sm">
              Creations artisanales de tricot et crochet fait main
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-accent-200">Boutique</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=pullovers"
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  Pulls & Gilets
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=accessories"
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-semibold mb-4 text-accent-200">À propos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link
                  href="/bespoke"
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  Commande sur mesure
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  Avis clients
                </Link>
              </li>
              <li>
                <Link
                  href="/cgv"
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  CGV
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-accent-200">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-300" />
                <a
                  href={`https://wa.me/${CONTACT_PHONE.replace(/\D/g, '')}?text=${WHATSAPP_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  {CONTACT_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-300" />
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${MAILTO_SUBJECT}&body=${MAILTO_BODY}`}
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex gap-3 mt-3">
                <a
                  href="https://www.instagram.com/knit.and.craft/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@knit.and.craft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-100 hover:text-accent-400 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.86 2.86 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.08A6.9 6.9 0 0 0 5 20.1a6.9 6.9 0 0 0 11.13-6.38v-3.27a8.5 8.5 0 0 0 3.46 1.25v-3.44a4.3 4.3 0 0 1-.4-.04c-.67-.04-1.36-.18-2.39-.46Z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-800 pt-6">
          <div className="flex flex-col gap-2">
            <a
              href="https://mosamdigital.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textAlign: 'right' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  gap: '0.3rem',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  color: '#c3a673',
                  fontSize: '0.9rem',
                }}
              >
                by 𖣘FGK
              </span>
            </a>
            <p className="text-center text-accent-100 text-sm">
              © 2026 Knit & Craft. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
