import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Créer un utilisateur admin avec mot de passe hashé
  const hashedPassword = await hash('Admin123!', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@knitandcraft.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin@knitandcraft.com',
      name: 'Admin Knit & Craft',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Créer des produits d'exemple
  const products = [
    {
      name: 'Pull Cozy en Laine',
      slug: 'pull-cozy-laine',
      description: 'Pull moelleux parfait pour l\'hiver',
      longDescription:
        'Un pull chaud et confortable fait à la main avec de la laine premium. Disponible en plusieurs couleurs.',
      image: 'https://images.unsplash.com/photo-1620799139507-2a76f479a0a7?w=500&h=500&fit=crop',
      basePrice: 450,
      discountPercentage: 10,
      stock: 5,
      category: 'Pulls',
      isCustomizable: true,
      allowExact: true,
      allowCustom: true,
      allowBespoke: false,
    },
    {
      name: 'Bonnet Tricoté',
      slug: 'bonnet-tricote',
      description: 'Bonnet classique et élégant',
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&h=500&fit=crop',
      basePrice: 150,
      discountPercentage: 0,
      stock: 12,
      category: 'Accessoires',
      isCustomizable: true,
      allowExact: true,
      allowCustom: true,
      allowBespoke: false,
    },
    {
      name: 'Écharpe Colorée',
      slug: 'echarpe-coloree',
      description: 'Écharpe longue et douce',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      basePrice: 200,
      discountPercentage: 15,
      stock: 8,
      category: 'Accessoires',
      isCustomizable: false,
      allowExact: true,
      allowCustom: false,
      allowBespoke: false,
    },
    {
      name: 'Gilet Crocheté',
      slug: 'gilet-crochet',
      description: 'Gilet aéré fait au crochet',
      image: 'https://images.unsplash.com/photo-1578932750294-708994cc4b00?w=500&h=500&fit=crop',
      basePrice: 380,
      discountPercentage: 5,
      stock: 3,
      category: 'Pulls',
      isCustomizable: true,
      allowExact: true,
      allowCustom: true,
      allowBespoke: true,
    },
  ]

  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: {
        ...product,
        customOptions: {
          create: product.isCustomizable
            ? [
                {
                  name: 'Couleur',
                  type: 'color',
                  values: JSON.stringify(['Noir', 'Blanc', 'Beige', 'Marron', 'Gris']),
                  isRequired: true,
                },
                {
                  name: 'Taille',
                  type: 'size',
                  values: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
                  isRequired: true,
                },
              ]
            : [],
        },
      },
    })

    // Créer les variants de délai pour chaque produit
    await prisma.productVariant.deleteMany({
      where: { productId: createdProduct.id }
    })

    await prisma.productVariant.createMany({
      data: [
        {
          productId: createdProduct.id,
          name: 'Normal',
          daysMin: 7,
          daysMax: 10,
          priceMultiplier: 1.0,
          description: 'Livraison standard - 7 à 10 jours',
        },
        {
          productId: createdProduct.id,
          name: 'Express',
          daysMin: 3,
          daysMax: 5,
          priceMultiplier: 1.5,
          description: 'Livraison express - 3 à 5 jours',
        },
        {
          productId: createdProduct.id,
          name: 'Premium',
          daysMin: 1,
          daysMax: 3,
          priceMultiplier: 2.0,
          description: 'Livraison premium - 1 à 3 jours',
        },
      ],
    })
  }

  // Créer des avis d'exemple
  const product = await prisma.product.findFirst()
  const user = await prisma.user.findFirst({ where: { role: 'CLIENT' } })

  if (product && user) {
    await prisma.review.upsert({
      where: {
        id: `${product.id}-${user.id}`,
      },
      update: {},
      create: {
        productId: product.id,
        userId: user.id,
        rating: 5,
        comment: 'Excellent produit, très satisfait!',
        isVerified: true,
      },
    })
  }

  console.log('✅ Seed data created successfully')
  console.log('Admin credentials:')
  console.log('  Email: admin@knitandcraft.com')
  console.log('  Password: Admin123!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
