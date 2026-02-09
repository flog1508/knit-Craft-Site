'use client'

import React from 'react'
import { Card } from '@/components/ui'

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-12">Conditions Générales de Vente</h1>

        <Card className="p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Conditions d&apos;accès au site</h2>
            <p className="text-gray-600 leading-relaxed">
              Le site Knit & Craft est accessible à tous les visiteurs sans inscription. Certaines
              fonctionnalités (panier, commande) nécessitent une création de compte.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Produits et Tarifs</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Tous les produits présentés sont décrits avec soin. Les tarifs sont affichés en dirham
              marocain (MAD). Les prix affichés sur le site sont désormais en dollars américains (USD). Les prix sont valables à la date de publication et peuvent être modifiés
              sans préavis.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nous nous réservons le droit d&apos;ajuster les stocks à tout moment en cas de rupture.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Processus de Commande</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              La commande s&apos;éffectue en ligne via notre panier. Les commandes doivent être finalisées
              via WhatsApp pour confirmation.
            </p>
            <p className="text-gray-600 leading-relaxed">
              La confirmation de commande sera envoyée par email dans les 24h suivant la soumission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Commandes Personnalisées</h2>
            <p className="text-gray-600 leading-relaxed">
              Pour les commandes sur mesure, un délai de création de 2-4 semaines est appliqué. Les
              délais seront confirmés au moment de la commande.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Paiement et Livraison</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Le paiement s&apos;éffectue via WhatsApp ou virement bancaire. La livraison est effectuée
              par courrier dans les 5-7 jours ouvrables après confirmation du paiement.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Les frais de port dépendent de la destination et seront calculés avant la finalisation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Retours et Remboursements</h2>
            <p className="text-gray-600 leading-relaxed">
              Les produits peuvent être retournés dans les 14 jours suivant la réception, s&apos;ils sont
              dans leur état original. Les retours ne sont pas acceptés pour les commandes personnalisées.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Responsabilité</h2>
            <p className="text-gray-600 leading-relaxed">
              Knit & Craft ne peut être tenu responsable pour les dommages causés durant le transport
              ou la livraison. Tout reclamation doit être signalée dans les 48h suivant la réception.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propriété Intellectuelle</h2>
            <p className="text-gray-600 leading-relaxed">
              Tous les contenus du site (textes, images, logos) sont la propriété de Knit & Craft.
              Toute reproduction sans autorisation est interdite.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modification des CGV</h2>
            <p className="text-gray-600 leading-relaxed">
              Knit & Craft se réserve le droit de modifier ces conditions à tout moment. Les
              modifications entreront en vigueur à la date de leur publication.
            </p>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Dernière mise à jour: Janvier 2026 | Version: 1.0
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
