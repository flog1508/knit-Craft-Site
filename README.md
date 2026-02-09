<<<<<<< HEAD
# knit-Craft-Site
=======
# Knit & Craft - Plateforme E-commerce Artisanale

## 📋 Vue d'ensemble

Site e-commerce professionnel et production-ready pour une boutique de tricot et crochet fait main. Plateforme complète avec catalogue de produits, panier persistant, commandes personnalisées et intégration WhatsApp.

## 🛠 Stack Technique

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Base de données**: PostgreSQL (configurable MongoDB)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **State Management**: Zustand
- **API**: REST API avec Next.js API Routes
- **Déploiement**: Vercel-ready

## 📁 Structure du Projet

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── products/          # Gestion produits
│   │   ├── checkout/          # Checkout & commandes
│   │   ├── contact/           # Formulaire contact
│   │   ├── reviews/           # Avis clients
│   │   ├── auth/[...nextauth] # Configuration NextAuth
│   │   └── admin/             # API admin
│   ├── (pages)
│   │   ├── page.tsx           # Accueil
│   │   ├── shop/              # Boutique
│   │   ├── product/[slug]     # Page produit
│   │   ├── cart/              # Panier
│   │   ├── checkout/          # Finalisation commande
│   │   ├── account/           # Mon compte
│   │   ├── about/             # À propos
│   │   ├── contact/           # Contact
│   │   ├── cgv/               # CGV
│   │   ├── reviews/           # Avis
│   │   ├── auth/              # Auth pages
│   │   └── admin/             # Dashboard admin
│   ├── globals.css            # Styles globaux
│   └── layout.tsx             # Layout principal
├── components/
│   ├── ui/                    # Composants réutilisables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── index.ts
├── hooks/
│   ├── useAuth.ts             # Hook authentification
│   ├── useCart.ts             # Hook gestion panier
│   ├── useApi.ts              # Hook requêtes API
│   └── index.ts
├── lib/
│   ├── prisma.ts              # Client Prisma
│   ├── auth.ts                # Configuration NextAuth
│   └── utils.ts               # Utilitaires
├── types/
│   └── index.ts               # Types TypeScript
└── middleware.ts              # Middleware NextAuth

prisma/
├── schema.prisma              # Schéma BD
└── migrations/                # Migrations BD
```

## 🚀 Installation

### 1. Cloner et installer

```bash
cd knit-and-craft-site
npm install
```

### 2. Configuration de la base de données

Créer un fichier `.env.local`:

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/knit_craft"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+212612345678

# OAuth (optionnel)
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
```

### 3. Initialiser la BD

```bash
npx prisma db push
npx prisma generate
```

### 4. Lancer le serveur

```bash
npm run dev
```

Accéder à http://localhost:3000

## 📊 Schéma de Base de Données

### Utilisateurs
- User (authentification, rôles)
- Account & Session (OAuth)

### Produits
- Product (catalogue)
- CustomOption (options personnalisation)
- Review (avis clients)

### Commandes
- Cart & CartItem (panier)
- Order & OrderItem (commandes)
- OrderCustomization (personnalisations commande)
- CustomOrder (commandes entièrement personnalisées)

### Autres
- Promotion (codes promo)
- ContactMessage (formulaire contact)
- Page (pages statiques)

## 🔑 Fonctionnalités Principales

### 🛍 Pour les Clients

- ✅ Inscription/Connexion (Email, Google, GitHub)
- ✅ Catalogue produits filtrable
- ✅ Panier persistant (Zustand)
- ✅ Personnalisation produits (couleur, taille, matière)
- ✅ Checkout avec adresse
- ✅ Intégration WhatsApp pour confirmation
- ✅ Historique commandes
- ✅ Avis et évaluations
- ✅ Wishlist (à implémenter)

### 👨‍💼 Pour les Admins

- ✅ Dashboard statistiques
- ✅ Gestion produits (CRUD)
- ✅ Gestion commandes (statuts)
- ✅ Gestion utilisateurs
- ✅ Gestion avis
- ✅ Gestion pages statiques
- ✅ Gestion promotions

### 📱 Spécificités

- ✅ Commande WhatsApp automatique
- ✅ Messages formatés avec détails produits
- ✅ Gestion stock (rupture/promotion)
- ✅ Badges dynamiques
- ✅ Design responsive & accessible
- ✅ Animations fluides

## 🔐 Authentification

NextAuth.js avec:
- Stratégie JWT
- Providers: Credentials, Google, GitHub
- Rôles: ADMIN, CLIENT, GUEST

## 💳 Processus Commande

1. Sélection produits + options
2. Panier persistant
3. Checkout avec formulaire
4. Génération message WhatsApp
5. Redirection wa.me/{number}?text={message}
6. Confirmation via WhatsApp

## 🎨 Palettes de Couleurs

- **Primary**: Beige/Brown (#a07d68)
- **Accent**: Terracotta (#d4b896)
- **Secondary**: Crème naturelle
- **Backgrounds**: Blancs chauds

## 📈 Performance & SEO

- ✅ Next.js Image Optimization
- ✅ Meta tags dynamiques
- ✅ Sitemap & robots.txt (à ajouter)
- ✅ Code splitting automatique
- ✅ ISR (Incremental Static Regeneration)

## 🚀 Déploiement sur Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main

# Sur Vercel Dashboard
# Importer le repo GitHub
# Configurer les variables d'env
# Deploy!
```

## 📚 API Endpoints

### Produits
- `GET /api/products` - Liste paginée
- `GET /api/products/[slug]` - Détails
- `POST /api/products` - Créer (admin)
- `PUT /api/products/[slug]` - Modifier (admin)

### Commandes
- `POST /api/checkout` - Créer commande
- `GET /api/checkout` - Mes commandes

### Admin
- `GET /api/admin/stats` - Statistiques
- `GET /api/admin/orders` - Toutes commandes
- `PUT /api/admin/orders` - Modifier statut

### Autres
- `POST /api/contact` - Envoyer contact
- `POST /api/reviews` - Poster avis
- `GET /api/reviews/top` - Top avis

## 🔧 Variables d'Environnement Requises

```env
# OBLIGATOIRE
DATABASE_URL=           # PostgreSQL URL
NEXTAUTH_URL=           # Base URL
NEXTAUTH_SECRET=        # Random secret (openssl rand -base64 32)
NEXT_PUBLIC_WHATSAPP_NUMBER=  # Numéro WhatsApp

# OPTIONNEL
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
NEXT_PUBLIC_ADMIN_EMAIL=
```

## 🛠 Commandes Utiles

```bash
# Dev
npm run dev

# Build
npm run build
npm run start

# Database
npx prisma db push    # Sync schema
npx prisma generate   # Generate client
npx prisma studio    # GUI DB

# Lint
npm run lint
```

## 📝 TODO / À Améliorer

- [ ] Wishlist client
- [ ] Filtres avancés
- [ ] Système de notation complet
- [ ] Email transactionnel
- [ ] Payment gateway (Stripe/2Checkout)
- [ ] Blog/Articles
- [ ] Analytics (Hotjar/Google Analytics)
- [ ] Sitemap & Meta SEO
- [ ] Multi-langue
- [ ] Dark mode
- [ ] Tests unitaires

## 📞 Support

Pour questions/bugs:
1. Vérifier les logs serveur
2. Consulter documentation Prisma/NextAuth
3. Vérifier variables d'env

## 📄 Licence

MIT - © 2026 Knit & Craft

---

**Dernière mise à jour**: Janvier 2026
**Version**: 1.0.0
**Status**: Production-Ready ✅
>>>>>>> 81d97bf (Initial commit)
