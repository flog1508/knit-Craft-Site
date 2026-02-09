import NextAuth from 'next-auth'
import { UserRole } from '@/types'

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: UserRole
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    role?: UserRole
  }

  interface JWT {
    id?: string
    role?: UserRole
  }
}
