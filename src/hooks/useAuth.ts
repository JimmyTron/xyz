/**
 * useAuth Hook
 * 
 * Provides authentication state and methods.
 */

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { 
  getCurrentUser, 
  signInWithGoogle, 
  signOut, 
  isAdmin,
  onAuthStateChange 
} from '../lib/api/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUserAdmin, setIsUserAdmin] = useState(false)

  useEffect(() => {
    // Get initial user
    loadUser()

    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null)
        checkAdminStatus(session?.user?.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsUserAdmin(false)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadUser = async () => {
    try {
      const result = await getCurrentUser()
      if (result.success && result.data) {
        setUser(result.data)
        await checkAdminStatus(result.data.id)
      }
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkAdminStatus = async (userId?: string) => {
    if (!userId) {
      setIsUserAdmin(false)
      return
    }
    const admin = await isAdmin()
    setIsUserAdmin(admin)
  }

  const signIn = async () => {
    const result = await signInWithGoogle()
    return result
  }

  const signOutUser = async () => {
    const result = await signOut()
    if (result.success) {
      setUser(null)
      setIsUserAdmin(false)
    }
    return result
  }

  return {
    user,
    loading,
    isAdmin: isUserAdmin,
    signIn,
    signOut: signOutUser,
    refresh: loadUser
  }
}





