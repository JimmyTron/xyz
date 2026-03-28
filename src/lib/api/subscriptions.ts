/**
 * Subscriptions API Functions
 * 
 * Handles subscription management and feature access control.
 */

import { supabase } from '../supabase'

export interface Subscription {
  id: string
  user_id: string
  plan_type: 'free' | 'premium' | 'pro'
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  current_period_start?: string
  current_period_end?: string
  stripe_subscription_id?: string
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  subscription_id?: string
  features: Record<string, any>
  usage_limits: Record<string, any>
  created_at: string
  updated_at: string
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: string) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

    // If no active subscription, return free tier
    if (!data) {
      return {
        success: true,
        data: {
          plan_type: 'free',
          status: 'active'
        } as Partial<Subscription>
      }
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error fetching user subscription:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch subscription'
    }
  }
}

/**
 * Create a new subscription
 */
export async function createSubscription(
  userId: string,
  planType: 'free' | 'premium' | 'pro',
  stripeSubscriptionId?: string
) {
  try {
    const subscriptionData: Partial<Subscription> = {
      user_id: userId,
      plan_type: planType,
      status: 'active',
      stripe_subscription_id: stripeSubscriptionId
    }

    if (planType !== 'free') {
      const now = new Date()
      subscriptionData.current_period_start = now.toISOString()
      // Set period end to 30 days from now
      const periodEnd = new Date(now)
      periodEnd.setDate(periodEnd.getDate() + 30)
      subscriptionData.current_period_end = periodEnd.toISOString()
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select()
      .single()

    if (error) throw error

    // Create user subscription details
    await createUserSubscriptionDetails(userId, data.id, planType)

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error creating subscription:', error)
    return {
      success: false,
      error: error.message || 'Failed to create subscription'
    }
  }
}

/**
 * Create user subscription details with features and limits
 */
async function createUserSubscriptionDetails(
  userId: string,
  subscriptionId: string,
  planType: 'free' | 'premium' | 'pro'
) {
  const features = getPlanFeatures(planType)
  const usageLimits = getPlanLimits(planType)

  const { data, error } = await supabase
    .from('user_subscriptions')
    .upsert([{
      user_id: userId,
      subscription_id: subscriptionId,
      features,
      usage_limits: usageLimits
    }], {
      onConflict: 'user_id'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get plan features based on tier
 */
function getPlanFeatures(planType: 'free' | 'premium' | 'pro'): Record<string, any> {
  const baseFeatures = {
    access_basic_blog: true,
    access_portfolio: true,
    access_services: true,
    access_skills: true
  }

  switch (planType) {
    case 'free':
      return {
        ...baseFeatures,
        access_premium_blog: false,
        priority_support: false,
        api_access: false
      }
    case 'premium':
      return {
        ...baseFeatures,
        access_premium_blog: true,
        priority_support: true,
        api_access: false
      }
    case 'pro':
      return {
        ...baseFeatures,
        access_premium_blog: true,
        priority_support: true,
        api_access: true,
        early_access_features: true,
        custom_integrations: true
      }
    default:
      return baseFeatures
  }
}

/**
 * Get plan usage limits based on tier
 */
function getPlanLimits(planType: 'free' | 'premium' | 'pro'): Record<string, any> {
  switch (planType) {
    case 'free':
      return {
        blog_posts_per_month: 10,
        api_calls_per_day: 0
      }
    case 'premium':
      return {
        blog_posts_per_month: -1, // unlimited
        api_calls_per_day: 1000
      }
    case 'pro':
      return {
        blog_posts_per_month: -1, // unlimited
        api_calls_per_day: 10000
      }
    default:
      return {}
  }
}

/**
 * Update subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<Subscription>
) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single()

    if (error) throw error

    // Update user subscription details if plan type changed
    if (updates.plan_type && data) {
      await createUserSubscriptionDetails(data.user_id, subscriptionId, updates.plan_type)
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error updating subscription:', error)
    return {
      success: false,
      error: error.message || 'Failed to update subscription'
    }
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscriptionId)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error cancelling subscription:', error)
    return {
      success: false,
      error: error.message || 'Failed to cancel subscription'
    }
  }
}

/**
 * Check if user has access to a specific feature
 */
export async function checkFeatureAccess(userId: string, feature: string): Promise<boolean> {
  try {
    const subscriptionResult = await getUserSubscription(userId)
    if (!subscriptionResult.success || !subscriptionResult.data) {
      return false
    }

    const { data: userSubscription, error } = await supabase
      .from('user_subscriptions')
      .select('features')
      .eq('user_id', userId)
      .single()

    if (error || !userSubscription) {
      // Fallback to plan type check
      const planType = subscriptionResult.data.plan_type || 'free'
      const features = getPlanFeatures(planType)
      return features[feature] === true
    }

    return userSubscription.features[feature] === true
  } catch (error) {
    console.error('Error checking feature access:', error)
    return false
  }
}

/**
 * Get usage statistics for a user
 */
export async function getUsageStats(userId: string) {
  try {
    const { data: userSubscription, error } = await supabase
      .from('user_subscriptions')
      .select('usage_limits')
      .eq('user_id', userId)
      .single()

    if (error) throw error

    // TODO: Implement actual usage tracking
    // For now, return the limits
    return {
      success: true,
      data: {
        limits: userSubscription?.usage_limits || {},
        usage: {} // To be implemented with actual tracking
      }
    }
  } catch (error: any) {
    console.error('Error fetching usage stats:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch usage stats'
    }
  }
}





