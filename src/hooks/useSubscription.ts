/**
 * useSubscription Hook
 * 
 * Provides subscription state and operations.
 */

import { useState, useEffect } from 'react'
import { getUserSubscription, checkFeatureAccess } from '../lib/api/subscriptions'
import type { Subscription } from '../lib/api/subscriptions'

export function useSubscription(userId?: string) {
  const [subscription, setSubscription] = useState<Partial<Subscription> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      loadSubscription()
    } else {
      // Default to free tier
      setSubscription({ plan_type: 'free', status: 'active' })
      setLoading(false)
    }
  }, [userId])

  const loadSubscription = async () => {
    if (!userId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await getUserSubscription(userId)
      if (result.success) {
        setSubscription(result.data || null)
      } else {
        setError(result.error || 'Failed to load subscription')
        // Default to free tier on error
        setSubscription({ plan_type: 'free', status: 'active' })
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setSubscription({ plan_type: 'free', status: 'active' })
    } finally {
      setLoading(false)
    }
  }

  const hasFeature = async (feature: string): Promise<boolean> => {
    if (!userId) return false
    return await checkFeatureAccess(userId, feature)
  }

  const isPremium = () => {
    return subscription?.plan_type === 'premium' || subscription?.plan_type === 'pro'
  }

  const isPro = () => {
    return subscription?.plan_type === 'pro'
  }

  return {
    subscription,
    loading,
    error,
    isPremium: isPremium(),
    isPro: isPro(),
    hasFeature,
    refresh: loadSubscription
  }
}





