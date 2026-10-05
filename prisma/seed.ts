import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { ACHIEVEMENTS } from '../src/lib/achievements'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed achievements
  const achievementCount = await prisma.achievement.count()
  if (achievementCount === 0) {
    for (const a of ACHIEVEMENTS) {
      await prisma.achievement.upsert({
        where: { key: a.key },
        update: {},
        create: {
          key: a.key,
          name: a.name,
          description: a.description,
          xpReward: a.xpReward,
        },
      })
    }
    console.log(`Seeded ${ACHIEVEMENTS.length} achievements`)
  } else {
    console.log('Achievements already seeded')
  }

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@sixthstringlabs.com'
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12)
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        purchaseStatus: 'PAID',
      },
    })
    console.log(`Created admin user: ${adminEmail}`)
  } else {
    console.log(`Admin user already exists: ${adminEmail}`)
  }

  // Create test paid user
  const testEmail = 'test@example.com'
  const existingTest = await prisma.user.findUnique({ where: { email: testEmail } })

  if (!existingTest) {
    const hashedPassword = await bcrypt.hash('test1234', 12)
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
        purchaseStatus: 'PAID',
      },
    })

    // Create profile for test user
    await prisma.profile.create({
      data: {
        userId: testUser.id,
        instrument: 'Electric',
        experienceMonths: 12,
        tabComfort: 3,
        hasBasicChords: true,
        hasLearnedSolo: false,
        pickingLevel: 3,
        hammerOnLevel: 2,
        pullOffLevel: 2,
        slideLevel: 2,
        bendLevel: 1,
        vibratoLevel: 1,
        pentatonicLevel: 1,
        styles: 'Rock,Blues',
        practiceMinutes: 20,
        currentDay: 1,
      },
    })
    console.log(`Created test user: ${testEmail} / test1234`)
  } else {
    console.log(`Test user already exists: ${testEmail}`)
  }

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
