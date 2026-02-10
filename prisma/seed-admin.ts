import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@knitandcraft.com'
  const password = 'Admin123!'

  const hashedPassword = await hash(password, 12)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email,
      name: 'Admin Knit & Craft',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user upserted:')
  console.log(`  Email: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

