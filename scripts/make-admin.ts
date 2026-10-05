import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.update({
    where: { email: 'zacharyjoolee@gmail.com' },
    data: { role: 'ADMIN' },
  })
  console.log('Done! Role set to ADMIN for:', user.email)
}

main().catch(console.error).finally(() => prisma.$disconnect())
