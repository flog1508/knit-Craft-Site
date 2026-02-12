'use client'

import React from 'react'

export default function CGVPage() {
  return (
    <div className="bg-primary-950">
      <section className="relative overflow-hidden bg-primary-900">
        <div className="absolute inset-0 opacity-100 mix-blend-multiply bg-[url('/images/why-choose.jpg')] bg-cover bg-center bg-fixed" />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-28 space-y-12 sm:space-y-16">
          <div className="text-center">
            <p className="uppercase tracking-[0.25em] text-accent-200 text-xs sm:text-sm mb-3">
              Informations légales
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-50 mb-4 sm:mb-6 leading-tight">
              Conditions Générales de <span className="text-accent-300">Vente</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-accent-100 max-w-2xl mx-auto leading-relaxed">
              Consultez les conditions qui régissent l&apos;utilisation de notre boutique et vos commandes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-primary-900/70 border border-primary-800 rounded-2xl p-6 lg:p-8 shadow-lg shadow-primary-900/40 space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-accent-200 mb-4">
                  1. Conditions d&apos;accès au site
                </h2>
                <p className="text-accent-100 leading-relaxed">
                  Le site Knit & Craft est accessible à tous les visiteurs sans inscription. Certaines
                  fonctionnalités (panier, commande) nécessitent une création de compte.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-accent-200 mb-4">
                  2. Produits et Tarifs
                </h2>
                <p className="text-accent-100 leading-relaxed mb-3">
                  Tous les produits présentés sont décrits avec soin. Les tarifs sont affichés en franc
                  Franc congolais (CDF). Les prix sont valables à la date de publication et peuvent être modifiés
                  sans préavis.
                </p>
                <p className="text-accent-100 leading-relaxed">
                  Nous nous réservons le droit d&apos;ajuster les stocks à tout moment en cas de rupture.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-accent-200 mb-4">
                  3. Processus de Commande
                </h2>
                <p className="text-accent-100 leading-relaxed mb-3">
                  La commande s&apos;effectue en ligne via notre panier. Les commandes doivent être finalisées
                  via WhatsApp pour confirmation.
                </p>
                <p className="text-accent-100 leading-relaxed">
                  La confirmation de commande sera envoyée par email dans les 24h suivant la soumission.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-accent-200 mb-4">
                  4. Commandes Personnalisées
                </h2>
                <p className="text-accent-100 leading-relaxed">
                  Pour les commandes sur mesure, un délai de création de 2-4 semaines est appliqué. Les
                  délais seront confirmés au moment de la commande.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-accent-200 mb-4">
                  5. Paiement et Livraison
                </h2>
                <p className="text-accent-100 leading-relaxed mb-3">
                  Le paiement s&apos;effectue via WhatsApp ou virement bancaire. La livraison est effectuée
                  par courrier dans les 5-7 jours ouvrables après confirmation du paiement.
                </p>
                <p className="text-accent-100 leading-relaxed">
                  Les frais de port dépendent de la destination et seront calculés avant la finalisation.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-accent-200 mb-4">
                  6. Retours et Remboursements
                </h2>
                <p className="text-accent-100 leading-relaxed">
                  Les produits peuvent être retournés dans les 14 jours suivant la réception, s&apos;ils sont
                  dans leur état original. Les retours ne sont pas acceptés pour les commandes personnalisées.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-accent-200 mb-4">
                  7. Responsabilité
                </h2>
                <p className="text-accent-100 leading-relaxed">
                  Knit & Craft ne peut être tenu responsable pour les dommages causés durant le transport
                  ou la livraison. Toute réclamation doit être signalée dans les 48h suivant la réception.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-accent-200 mb-4">
                  8. Propriété Intellectuelle
                </h2>
                <p className="text-accent-100 leading-relaxed">
                  Tous les contenus du site (textes, images, logos) sont la propriété de Knit & Craft.
                  Toute reproduction sans autorisation est interdite.
                </p>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-accent-200 mb-4">
                  9. Modification des CGV
                </h2>
                <p className="text-accent-100 leading-relaxed">
                  Knit & Craft se réserve le droit de modifier ces conditions à tout moment. Les
                  modifications entreront en vigueur à la date de leur publication.
                </p>
              </div>

              <div className="pt-8 border-t border-primary-800">
                <p className="text-sm text-accent-100">
                  Dernière mise à jour : Janvier 2026 | Version : 1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
