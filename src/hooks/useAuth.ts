import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/types'
import { useEffect } from 'react'

export const useAuth = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const isAdmin = session?.user?.role === UserRole.ADMIN

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    isAdmin,
    user: session?.user,
  }
}

export const useRequireAuth = (callback?: () => void) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    } else if (isAuthenticated && callback) {
      callback()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated])
}

export const useRequireAdmin = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/unauthorized')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, isAdmin])
}
