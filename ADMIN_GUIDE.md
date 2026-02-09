# Guide Admin - Knit & Craft

## 🔑 Accès Dashboard Admin

**URL**: https://votre-domaine.com/admin

**Condition**: Vous devez avoir le rôle `ADMIN`

### Créer un Compte Admin

#### 1️⃣ Via Prisma Studio (Développement)

```bash
npx prisma studio
```

1. Table `User`
2. Créer un nouvel enregistrement:
   - name: "Votre Nom"
   - email: "email@example.com"
   - role: "ADMIN"

#### 2️⃣ Via Base de Données Directe (Production)

```sql
INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'admin@example.com', 'Admin Name', 'ADMIN', NOW(), NOW());
```

---

## 📊 Dashboard Principal

Affiche les statistiques en temps réel:
- **Total Commandes**: Nombre de commandes passées
- **Total Produits**: Nombre d'articles en catalogue
- **Total Utilisateurs**: Clients enregistrés
- **Revenus**: Montant total des ventes

---

## 📦 Gestion Produits

### ➕ Ajouter un Produit

1. Aller à `/admin/products`
2. Cliquer "Nouveau produit"
3. Remplir le formulaire:

**Champs Obligatoires:**
- Nom
- Slug (URL friendly, ex: pull-cozy-laine)
- Description courte
- Prix
- Catégorie
- Image URL

**Champs Optionnels:**
- Description longue
- Images supplémentaires
- Promo (%)
- Personnalisation disponible

**Exemple:**

```
Nom: Pull Cozy en Laine
Slug: pull-cozy-laine
Description: Pull moelleux parfait pour l'hiver
Prix: 450
Catégorie: Pulls
Promo: 10%
Image: https://images.unsplash.com/...
```

### ✏️ Modifier un Produit

1. Aller à `/admin/products`
2. Cliquer l'icône 📝 d'édition
3. Modifier les champs
4. Sauvegarder

### 🗑️ Supprimer un Produit

1. Aller à `/admin/products`
2. Cliquer l'icône 🗑️
3. Confirmer la suppression

### 📊 Ajouter des Options (Couleurs, Tailles)

**Via Prisma Studio:**

1. Ouvrir `npx prisma studio`
2. Table `CustomOption`
3. Créer une option:
   - productId: ID du produit
   - name: "Couleur" ou "Taille"
   - type: "color" ou "size"
   - values: ["Noir", "Blanc", "Beige"]

---

## 🛒 Gestion Commandes

### 📋 Voir les Commandes

1. Aller à `/admin/orders`
2. Liste de toutes les commandes avec:
   - Numéro de commande
   - Client
   - Montant
   - Statut
   - Date

### 🔄 Changer le Statut

**Statuts disponibles:**
- 🟡 PENDING - En attente de confirmation
- 🔵 CONFIRMED - Commande confirmée
- 🔵 PROCESSING - En préparation
- 🔵 SHIPPED - Envoyée
- 🟢 DELIVERED - Livrée
- 🔴 CANCELLED - Annulée

**Workflow Typique:**
```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
```

### 📱 Message WhatsApp

Les commandes incluent le message WhatsApp formaté avec:
- Nom du client
- Liste des produits
- Options personnalisées
- Montant total

---

## 👥 Gestion Utilisateurs

### 👀 Voir les Utilisateurs

Via Prisma Studio:
```bash
npx prisma studio
```

Table `User` - Voir:
- Email
- Nom
- Rôle
- Date d'inscription

### 🔄 Changer le Rôle

1. Prisma Studio > Table `User`
2. Éditer l'utilisateur
3. Changer `role`:
   - ADMIN
   - CLIENT
   - GUEST

### 🔐 Supprimer un Utilisateur

⚠️ **Attention**: Supprime aussi les commandes associées

```bash
npx prisma studio
# Delete dans la table User
```

---

## 💰 Gestion des Promotions

### ➕ Créer une Promo

Via Prisma Studio:

1. Table `Promotion`
2. Créer:
   - code: "NOEL2026"
   - discountPercentage: 20
   - description: "20% sur tout"
   - startDate: Date de début
   - endDate: Date de fin
   - maxUses: Limite d'utilisation (optionnel)

### 📊 Appliquer une Promo à un Produit

1. Accéder au produit dans `/admin/products`
2. Éditer: `discountPercentage: 20`
3. Sauvegarder

**Note**: Les promos produit et codes promo fonctionnent différemment:
- Promo **Produit** = Réduction fixe sur cet article
- Code **Promo** = Code coupon client (à implémenter)

---

## ⭐ Gestion Avis Clients

### 👀 Voir les Avis

Via Prisma Studio:

1. Table `Review`
2. Voir:
   - Produit
   - Client
   - Notation (1-5)
   - Commentaire
   - Utile (votes)

### ✅ Valider un Avis

Changer `isVerified` à `true` pour le montrer:

```sql
UPDATE "Review" SET "isVerified" = true WHERE id = 'xxx';
```

### 🗑️ Supprimer un Avis

1. Prisma Studio > Table `Review`
2. Delete

---

## 📄 Pages Statiques

### ✏️ Éditer About, CGV, etc.

Via Prisma Studio:

1. Table `Page`
2. Éditer:
   - slug: "about" | "cgv" | "mentions-legales"
   - title: Titre
   - content: Contenu HTML/Texte

**Exemple:**
```
slug: about
title: À Propos de Knit & Craft
content: Nous sommes une boutique artisanale...
```

### 📨 Contact Messages

1. Table `ContactMessage`
2. Voir les messages reçus
3. Marquer comme lus
4. Répondre (optionnel)

---

## 🔧 Maintenance

### 🗄️ Backup Base de Données

```bash
# PostgreSQL
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# MongoDB
mongodump --uri=$DATABASE_URL --out=./backup
```

### 🧹 Nettoyer les Données

**Supprimer les anciennes commandes:**
```sql
DELETE FROM "Order" WHERE "createdAt" < NOW() - INTERVAL '1 year';
```

**Vider le panier des utilisateurs inactifs:**
```sql
DELETE FROM "Cart" WHERE "updatedAt" < NOW() - INTERVAL '30 days';
```

### 🔍 Vérifier la Santé de la BD

```bash
npx prisma db execute --stdin < check.sql
```

---

## 📊 Rapports

### Ventes par Catégorie

Via Prisma Studio:

```sql
SELECT p.category, COUNT(oi.id) as count, SUM(o.totalPrice) as revenue
FROM "OrderItem" oi
JOIN "Product" p ON oi."productId" = p.id
JOIN "Order" o ON oi."orderId" = o.id
GROUP BY p.category;
```

### Top Produits

```sql
SELECT p.name, COUNT(oi.id) as sales, SUM(oi.quantity) as quantity
FROM "OrderItem" oi
JOIN "Product" p ON oi."productId" = p.id
GROUP BY p.id, p.name
ORDER BY sales DESC
LIMIT 10;
```

### Clients VIP

```sql
SELECT u.email, u.name, COUNT(o.id) as orders, SUM(o.totalPrice) as spent
FROM "User" u
JOIN "Order" o ON u.id = o."userId"
GROUP BY u.id
ORDER BY spent DESC
LIMIT 20;
```

---

## 🆘 Troubleshooting

### Impossible d'accéder au dashboard

- ✅ Vérifier votre rôle (`ADMIN`)
- ✅ Vous connecter avec le bon compte
- ✅ Vérifier l'URL: `/admin`

### Les produits n'apparaissent pas

- ✅ Vérifier `stock > 0`
- ✅ Vérifier `isOutOfStock = false`
- ✅ Actualiser la page

### Les commandes n'apparaissent pas

- ✅ Vérifier que des commandes existent (Table `Order`)
- ✅ Vérifier les logs: `vercel logs --tail`

### Base de données pleine

- ✅ Nettoyer les anciennes données
- ✅ Archiver les anciennes commandes
- ✅ Contacter le provider (Vercel, Railway, etc.)

---

## 📞 Support

**Issues courantes?**
1. Consulter les logs: `vercel logs --tail`
2. Vérifier Prisma Studio pour les données
3. Tester les API: `/api/admin/stats`

**Besoin d'aide avancée?**
- Docs Prisma: https://www.prisma.io/docs
- Docs Next.js: https://nextjs.org/docs
- Discord Prisma: https://discord.com/invite/prisma

---

**Dernière mise à jour**: Janvier 2026
