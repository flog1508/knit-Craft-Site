# Knit & Craft - Guide d'Installation & Configuration

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- PostgreSQL 13+ (ou MongoDB)
- npm/yarn

### 1️⃣ Installation

```bash
# Cloner/extraire le projet
cd knit-and-craft-site

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate
```

### 2️⃣ Configuration Base de Données

**Option 1: PostgreSQL (Recommandé)**

```env
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/knit_craft"
```

**Option 2: MongoDB**

```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/knit_craft"
```

### 3️⃣ Configuration NextAuth

```bash
# Générer un secret
openssl rand -base64 32
```

```env
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_généré
```

### 4️⃣ Configuration WhatsApp

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=+212612345678
```

### 5️⃣ Initialiser la BD

```bash
# Créer les tables
npx prisma db push

# Voir les données (GUI)
npx prisma studio
```

### 6️⃣ Démarrer le serveur

```bash
npm run dev
```

Accéder à: **http://localhost:3000**

---

## 🔐 Configuration OAuth (Optionnel)

### Google
1. Aller à [Google Cloud Console](https://console.cloud.google.com)
2. Créer un projet
3. Activer "Google+ API"
4. Créer des identifiants OAuth 2.0
5. Ajouter à `.env.local`:

```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

### GitHub
1. Aller à Settings > Developer Settings > OAuth Apps
2. Create New OAuth App
3. Ajouter à `.env.local`:

```env
GITHUB_ID=xxx
GITHUB_SECRET=xxx
```

---

## 📝 Données de Test

### Créer un admin

```bash
npx prisma studio
```

1. Ouvrir table `User`
2. Créer un nouvel enregistrement:
   - name: "Admin Test"
   - email: "admin@test.com"
   - role: "ADMIN"

### Ajouter des produits

```bash
npx prisma studio
```

1. Table `Product` > Create
2. Remplir les champs:
   - name: "Pull Cozy"
   - slug: "pull-cozy"
   - description: "..."
   - price: 299
   - stock: 10
   - category: "Pulls"
   - image: "/images/product.jpg"

---

## ✅ Checklist Post-Installation

- [ ] `.env.local` configuré
- [ ] BD initialisée (`npx prisma db push`)
- [ ] `npm run dev` fonctionne
- [ ] Accueil accessible sur http://localhost:3000
- [ ] Boutique chargeable
- [ ] Authentification testée
- [ ] Panier fonctionne

---

## 🐛 Troubleshooting

### "Error: Cannot find module 'next'"
```bash
npm install
npx prisma generate
```

### "Error connecting to database"
- Vérifier la connexion PostgreSQL
- Vérifier `DATABASE_URL` dans `.env.local`
- Créer la base de données manuellement

### "NextAuth error"
- Vérifier `NEXTAUTH_SECRET` renseigné
- Vérifier `NEXTAUTH_URL` correspond à votre domaine

### "Prisma schema out of sync"
```bash
npx prisma generate
npx prisma db push
```

---

## 📚 Structure des Pages

| URL | Type | Rôle |
|-----|------|------|
| `/` | Public | Accueil |
| `/shop` | Public | Boutique |
| `/product/[slug]` | Public | Fiche produit |
| `/cart` | Public | Panier |
| `/checkout` | Auth | Finaliser commande |
| `/account` | Auth | Mon compte |
| `/auth/signin` | Public | Connexion |
| `/about` | Public | À propos |
| `/contact` | Public | Contact |
| `/cgv` | Public | Conditions |
| `/reviews` | Public | Avis |
| `/admin` | Admin | Dashboard |
| `/admin/products` | Admin | Gérer produits |
| `/admin/orders` | Admin | Commandes |

---

## 🎨 Personnalisation

### Couleurs
Éditer `tailwind.config.ts`:
```ts
colors: {
  primary: {...},    // Beige/Brown
  accent: {...},     // Terracotta
  terracotta: {...}  // Crème
}
```

### Logo/Branding
- Logo: `src/components/Header.tsx` (ligne du logo 🧶)
- Titre: Chercher "Knit & Craft" dans les fichiers

### Informations Contact
- `src/components/Footer.tsx` - Contact footer
- `.env.local` - NEXT_PUBLIC_WHATSAPP_NUMBER

---

## 🚀 Déploiement

### Vercel (Recommandé)

1. Pousser le code sur GitHub
2. Aller sur [Vercel Dashboard](https://vercel.com)
3. "Import Project" > Sélectionner le repo
4. Configurer les variables d'env:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` = votre_domaine.vercel.app
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. Deploy!

### Environnement Production

```env
NEXTAUTH_URL=https://votre-domaine.com
NODE_ENV=production
```

---

## 📊 Monitoring

### Logs
```bash
# Production logs
vercel logs [project-name]

# Local logs
npm run dev  # Voir les logs en console
```

### Database
```bash
# Accéder au GUI Prisma
npx prisma studio
```

---

## 🔒 Sécurité

### Checklist Avant Production
- [ ] `NEXTAUTH_SECRET` changé
- [ ] OAuth tokens sécurisés
- [ ] Variables d'env configurées
- [ ] HTTPS activé
- [ ] Rate limiting activé
- [ ] Validation des inputs
- [ ] CORS configuré si nécessaire

---

**Besoin d'aide?** Consulter:
- [Docs NextAuth](https://next-auth.js.org)
- [Docs Prisma](https://www.prisma.io/docs)
- [Docs Next.js](https://nextjs.org/docs)
