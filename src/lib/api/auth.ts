/**
 * Authentication API Functions
 * 
 * Handles Google OAuth authentication and admin role checking.
 */

import { supabase } from '../supabase'

export interface AdminUser {
  id: string
  role: 'admin' | 'super_admin'
  created_at: string
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error signing in with Google:', error)
    return {
      success: false,
      error: error.message || 'Failed to sign in with Google'
    }
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Error signing out:', error)
    return {
      success: false,
      error: error.message || 'Failed to sign out'
    }
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) throw error

    return {
      success: true,
      data: user
    }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message
    }
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) throw error

    return {
      success: true,
      data: session
    }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message
    }
  }
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    const { data, error } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', user.id)
      .single()

    if (error || !data) return false

    return true
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Get admin user details
 */
export async function getAdminUser(userId: string) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message
    }
  }
}

/**
 * Require admin - throws error if user is not admin
 * Use this as a middleware check before admin operations
 */
export async function requireAdmin() {
  const adminStatus = await isAdmin()
  if (!adminStatus) {
    throw new Error('Admin access required')
  }
  return true
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}





