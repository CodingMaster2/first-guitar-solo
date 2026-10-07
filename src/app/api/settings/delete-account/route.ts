import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Delete in order to satisfy FK constraints
    await prisma.coachMessage.deleteMany({ where: { userId } })
    await prisma.practiceSession.deleteMany({ where: { userId } })
    await prisma.progress.deleteMany({ where: { userId } })
    await prisma.feedback.deleteMany({ where: { userId } })
    await prisma.supportTicket.deleteMany({ where: { userId } })
    await prisma.lessonComment.deleteMany({ where: { userId } })
    await prisma.userAchievement.deleteMany({ where: { userId } })
    await prisma.couponRedemption.deleteMany({ where: { userId } })
    // AccountabilityPartner — both sides of the relation
    await prisma.accountabilityPartner.deleteMany({ where: { userId } })
    await prisma.accountabilityPartner.deleteMany({ where: { partnerId: userId } })
    // AdminLog — must be removed before user deletion
    await prisma.adminLog.deleteMany({ where: { adminId: userId } })
    await prisma.profile.deleteMany({ where: { userId } })
    await prisma.passwordResetToken.deleteMany({ where: { userId } })
    await prisma.user.delete({ where: { id: userId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
