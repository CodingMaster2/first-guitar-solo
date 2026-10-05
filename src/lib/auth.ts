import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        const passwordValid = await bcrypt.compare(credentials.password, user.password)

        if (!passwordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          purchaseStatus: user.purchaseStatus,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session: sessionData }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? 'USER'
        token.purchaseStatus = (user as { purchaseStatus?: string }).purchaseStatus ?? 'UNPAID'
      }
      // When client calls update({ purchaseStatus: 'PAID' }), apply it to the token
      if (trigger === 'update' && (sessionData as { purchaseStatus?: string })?.purchaseStatus) {
        token.purchaseStatus = (sessionData as { purchaseStatus: string }).purchaseStatus
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.purchaseStatus = token.purchaseStatus as string
      }
      return session
    },
  },
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
      purchaseStatus: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    purchaseStatus: string
  }
}
