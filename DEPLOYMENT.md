# Guide de Déploiement - Knit & Craft

## 🚀 Déploiement sur Vercel (Recommandé)

### Étape 1: Préparation GitHub

```bash
# Initialiser Git (si pas fait)
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Knit & Craft - Initial deployment"

# Créer un repo GitHub et pousser
git branch -M main
git remote add origin https://github.com/votre-username/knit-craft.git
git push -u origin main
```

### Étape 2: Configuration Vercel

1. Accéder à https://vercel.com
2. Se connecter avec GitHub
3. Cliquer "Import Project"
4. Sélectionner le repo `knit-craft`
5. Configurer les variables d'env:

```env
# Obligatoires
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=votre_secret_genere
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=+212612345678

# Optionnel (OAuth)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
```

6. Cliquer "Deploy"
7. Attendre la fin du déploiement (~2 min)

### Étape 3: Domaine Personnalisé

1. Dans Vercel > Project Settings > Domains
2. Ajouter votre domaine
3. Suivre les instructions DNS
4. Mettre à jour `NEXTAUTH_URL`:

```env
NEXTAUTH_URL=https://votre-domaine.com
```

---

## 🗄️ Configuration Base de Données en Production

### PostgreSQL (Heroku/Railway/Render)

#### Option 1: Heroku PostgreSQL
```bash
# Créer l'addon
heroku addons:create heroku-postgresql:hobby-dev

# Récupérer l'URL
heroku config:get DATABASE_URL

# Ajouter à Vercel
```

#### Option 2: Railway
1. Créer un projet Railway
2. Ajouter PostgreSQL
3. Copier la connection string
4. Configurer dans Vercel

#### Option 3: Render
1. Créer une DB PostgreSQL
2. Copier l'URL interne
3. Format: `postgresql://user:password@host:port/db`

### Initialiser la BD en Production

```bash
# Via Vercel CLI
vercel env pull .env.local

# Initialiser le schéma
npx prisma db push --skip-generate

# Lancer le seed (optionnel)
npx prisma db seed
```

---

## 🔐 Variables d'Environnement Production

### Générer NEXTAUTH_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Windows
[convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object { [char][byte](Get-Random -Maximum 256) }) -join ''))
```

### Checklist Variables

- [x] `DATABASE_URL` - URL PostgreSQL
- [x] `NEXTAUTH_URL` - Domaine production
- [x] `NEXTAUTH_SECRET` - Secret aléatoire
- [x] `NEXT_PUBLIC_WHATSAPP_NUMBER` - Numéro WhatsApp
- [x] OAuth (si utilisé): `GOOGLE_CLIENT_ID`, `GITHUB_ID`

---

## 🔍 Vérification Post-Déploiement

```bash
# 1. Accéder au site
# https://votre-domaine.com

# 2. Vérifier les pages principales
# - Accueil
# - Shop
# - Authentification
# - Panier & Checkout

# 3. Tester l'authentification
# - Sign up
# - Sign in
# - OAuth (Google/GitHub)

# 4. Vérifier l'API
# GET https://votre-domaine.com/api/products
# Devrait retourner du JSON

# 5. Logs
# vercel logs [project-name]
```

---

## 🆘 Troubleshooting Déploiement

### Build échoue

```bash
# Vérifier les erreurs
vercel logs --tail

# Solutions courantes:
# 1. Variables d'env manquantes
# 2. Erreurs TypeScript
# 3. Node version incompatible
```

### Database connection failed

```bash
# 1. Vérifier DATABASE_URL
vercel env list

# 2. Tester la connexion
# Dans Vercel > Deployments > View Function Logs
# Chercher les logs Prisma

# 3. S'assurer que:
# - Schéma est déployé (npx prisma db push)
# - Credentials PostgreSQL sont correctes
# - IP Vercel est whitelistée (si nécessaire)
```

### NextAuth errors

```bash
# 1. NEXTAUTH_SECRET non défini
# Vérifier dans Vercel Dashboard > Settings > Environment Variables

# 2. NEXTAUTH_URL incorrect
# Doit matcher: https://votre-domaine.com

# 3. OAuth non configuré
# Mettre à jour les callback URLs chez Google/GitHub
```

### WhatsApp link not working

```env
# Vérifier le numéro
NEXT_PUBLIC_WHATSAPP_NUMBER=+212612345678

# Format correct:
# +[CountryCode][Number]
# +212 pour Maroc
# +33 pour France
```

---

## 📊 Monitoring en Production

### Vercel Analytics

1. Vercel Dashboard > Project > Settings > Analytics
2. Activer Web Analytics
3. Voir les performances en temps réel

### Database Monitoring

```bash
# Accéder à Prisma Studio (local)
# En production, utiliser le provider directement
# ex: Railway Dashboard pour voir la DB
```

### Logs

```bash
# Temps réel
vercel logs [project-name] --tail

# Erreurs seulement
vercel logs [project-name] --follow
```

---

## 🔄 Mise à Jour en Production

### Pipeline Simple

```bash
# 1. Dev & Test en local
npm run dev

# 2. Pousser les changements
git add .
git commit -m "Feature: description"
git push origin main

# 3. Vercel déploie automatiquement
# (voir les logs: vercel logs --tail)

# 4. Vérifier en production
# https://votre-domaine.com
```

### Prisma Schema Update

```bash
# Local
npx prisma db push

# Git push
git add prisma/
git commit -m "Update schema"
git push

# Production (auto via build)
# Prisma va appliquer les migrations
```

---

## 💾 Backups & Disaster Recovery

### Backup Database

**PostgreSQL:**
```bash
# Avec pgAdmin (interface web)
# Ou via ligne de commande
pg_dump $DATABASE_URL > backup.sql

# Restaurer
psql $DATABASE_URL < backup.sql
```

**Via Provider:**
- Heroku: Automatic daily backups
- Railway: Snapshots feature
- Render: Automated backups

### Restore Procédure

1. Récupérer le backup
2. Créer une nouvelle DB
3. Restaurer les données
4. Mettre à jour DATABASE_URL
5. Redéployer

---

## 🔒 Sécurité Production

### Checklist

- [x] HTTPS activé (Vercel auto)
- [x] NEXTAUTH_SECRET unique & fort
- [x] Variables d'env sécurisées
- [x] Database whitelisted (IP Vercel)
- [x] Rate limiting (à ajouter)
- [x] CORS configuré
- [x] Input validation
- [x] SQL injection protection (Prisma ORM)

### Activer Rate Limiting (Optionnel)

```bash
npm install express-rate-limit
```

Dans `src/middleware.ts`:
```ts
// À implémenter selon besoin
```

---

## 📈 Performance Optimization

### Vercel Speed Insights

1. Accéder au projet Vercel
2. Voir Core Web Vitals
3. Optimiser LCP, FID, CLS

### Image Optimization

Déjà configuré via Next.js Image:
```tsx
<Image
  src={...}
  alt={...}
  fill
  className="object-cover"
/>
```

### Database Query Optimization

- Utiliser `include` seulement si nécessaire
- Paginer les résultats (limit/skip)
- Indexer les colonnes utilisées

---

## 🎯 Prochaines Étapes

1. ✅ Déployer sur Vercel
2. ✅ Configurer domaine
3. ⏳ Ajouter des produits (Admin)
4. ⏳ Configurer analytics
5. ⏳ Setup emails (SendGrid)
6. ⏳ Add payment gateway (Stripe)

---

**Support**: Consulter les docs:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
