# API Documentation - Knit & Craft

## 🔌 Base URL

```
Development: http://localhost:3000/api
Production: https://votre-domaine.com/api
```

## 🔐 Authentification

Tous les endpoints sauf ceux marqués `PUBLIC` nécessitent une session authentifiée.

**Headers:**
```http
Authorization: Bearer <session-token>
Content-Type: application/json
```

---

## 📦 Produits

### GET /products
Récupère la liste des produits avec pagination.

**Query Params:**
- `skip` (int): Nombre d'éléments à ignorer (défaut: 0)
- `take` (int): Nombre d'éléments à retourner (défaut: 12)
- `category` (string): Filtrer par catégorie

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "name": "Pull Cozy",
      "slug": "pull-cozy",
      "description": "...",
      "price": 450,
      "discountPercentage": 10,
      "stock": 5,
      "isOutOfStock": false,
      "category": "Pulls",
      "image": "https://...",
      "images": [],
      "isCustomizable": true,
      "customOptions": [
        {
          "id": "cuid",
          "name": "Couleur",
          "type": "color",
          "values": ["Noir", "Blanc"]
        }
      ]
    }
  ],
  "total": 42,
  "skip": 0,
  "take": 12
}
```

**Exemple:**
```bash
curl "http://localhost:3000/api/products?skip=0&take=12&category=Pulls"
```

---

### GET /products/:slug
Récupère les détails d'un produit spécifique avec les 5 derniers avis.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid",
    "name": "Pull Cozy",
    "slug": "pull-cozy",
    "description": "...",
    "longDescription": "...",
    "price": 450,
    "discountPercentage": 10,
    "stock": 5,
    "isOutOfStock": false,
    "category": "Pulls",
    "image": "https://...",
    "customOptions": [...],
    "reviews": [
      {
        "id": "cuid",
        "rating": 5,
        "comment": "Excellent!",
        "user": { "name": "John", "image": null }
      }
    ]
  }
}
```

**Exemple:**
```bash
curl "http://localhost:3000/api/products/pull-cozy"
```

---

### POST /products (ADMIN)
Crée un nouveau produit.

**Body:**
```json
{
  "name": "Pull Cozy",
  "slug": "pull-cozy",
  "description": "Pull moelleux",
  "longDescription": "...",
  "price": 450,
  "discountPercentage": 10,
  "stock": 5,
  "category": "Pulls",
  "image": "https://...",
  "isCustomizable": true
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### PUT /products/:slug (ADMIN)
Modifie un produit existant.

**Body:** Mêmes champs que POST

---

## 🛒 Panier

**Note**: Le panier est géré côté client avec Zustand. Pas d'endpoints API pour le panier.

Structure locale du panier:
```ts
{
  id: string
  productId: string
  quantity: number
  customizations: {
    optionName: string
    optionValue: string
  }[]
}
```

---

## 🛍️ Commandes

### POST /checkout (AUTH)
Crée une commande et génère le lien WhatsApp.

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+212612345678",
  "address": "123 Rue de la Paix",
  "city": "Casablanca",
  "postalCode": "20000",
  "country": "Maroc",
  "items": [
    {
      "productId": "cuid",
      "quantity": 2,
      "price": 450,
      "customizations": [
        {
          "optionName": "Couleur",
          "optionValue": "Noir"
        }
      ]
    }
  ],
  "totalPrice": 900
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "cuid",
      "orderNumber": "ORD0001234",
      "status": "PENDING",
      "totalPrice": 900,
      "items": [...]
    },
    "whatsappLink": "https://wa.me/212612345678?text=..."
  }
}
```

---

### GET /checkout (AUTH)
Récupère les commandes de l'utilisateur authentifié.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "orderNumber": "ORD0001234",
      "status": "DELIVERED",
      "totalPrice": 900,
      "items": [...],
      "createdAt": "2026-01-24T10:00:00Z"
    }
  ]
}
```

---

## 💬 Avis

### GET /reviews/top
Récupère les 20 meilleurs avis vérifiés.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "productId": "cuid",
      "rating": 5,
      "comment": "Excellent produit!",
      "helpful": 12,
      "user": { "name": "John", "image": null },
      "createdAt": "2026-01-20T10:00:00Z"
    }
  ]
}
```

---

### POST /reviews (AUTH)
Publie un avis pour un produit acheté.

**Body:**
```json
{
  "productId": "cuid",
  "rating": 5,
  "comment": "Excellent produit!"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 📧 Contact

### POST /contact (PUBLIC)
Envoie un message de contact.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+212612345678",
  "subject": "Question produit",
  "message": "Avez-vous..."
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 👨‍💼 Admin

### GET /admin/stats (ADMIN)
Récupère les statistiques du dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 42,
    "totalProducts": 150,
    "totalUsers": 1200,
    "totalRevenue": 45000
  }
}
```

---

### GET /admin/orders (ADMIN)
Récupère toutes les commandes.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "orderNumber": "ORD0001234",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "totalPrice": 900,
      "status": "PENDING",
      "items": [...]
    }
  ]
}
```

---

### PUT /admin/orders (ADMIN)
Modifie le statut d'une commande.

**Body:**
```json
{
  "orderId": "cuid",
  "status": "SHIPPED"
}
```

**Statuts valides:**
- PENDING
- CONFIRMED
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

---

## 🔐 Authentification

### GET /auth/session
Récupère la session actuelle.

**Response:**
```json
{
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null,
    "role": "CLIENT"
  },
  "expires": "2026-02-24T10:00:00Z"
}
```

---

## ❌ Codes d'Erreur

```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

**Codes HTTP:**
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## 📝 Exemples cURL

### Récupérer les produits

```bash
curl -X GET "http://localhost:3000/api/products?skip=0&take=12"
```

### Créer une commande

```bash
curl -X POST "http://localhost:3000/api/checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+212612345678",
    "address": "123 Rue",
    "city": "Casablanca",
    "postalCode": "20000",
    "country": "Maroc",
    "items": [],
    "totalPrice": 0
  }'
```

### Envoyer un message

```bash
curl -X POST "http://localhost:3000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "phone": "+212612345678",
    "subject": "Test",
    "message": "Ceci est un test"
  }'
```

---

## 🧪 Postman Collection

Importer dans Postman:

```json
{
  "info": {
    "name": "Knit & Craft API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Products",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/products?skip=0&take=12"
      }
    }
  ]
}
```

---

**Documentation**: À jour pour v1.0.0 (Janvier 2026)
