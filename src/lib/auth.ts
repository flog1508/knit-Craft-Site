import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// OAuth providers intentionally omitted to prevent public signups
import { compare } from 'bcryptjs'
import { prisma } from './prisma'
import { UserRole } from '@/types'

export const authOptions: NextAuthOptions = {
  providers: [
    // OAuth providers removed to prevent public signups; only admin will
    // authenticate via credentials. Uncomment providers if you want social login.
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: (async (credentials: any) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('No user found with this email')
        }

        // Vérifier le mot de passe
        const isPasswordValid = await compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email ?? '',
          name: user.name ?? '',
          role: user.role,
        }
      }) as any,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })
        token.role = dbUser?.role || UserRole.CLIENT
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id ?? '') as string
        session.user.role = token.role as UserRole
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Créer l'utilisateur s'il n'existe pas
      if (user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: UserRole.CLIENT,
            },
          })
        }
      }
      return true
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET,
}
