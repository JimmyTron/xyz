/**
 * useBlog Hook
 * 
 * Provides blog posts data and operations.
 */

import { useState, useEffect } from 'react'
import { getBlogPosts, getBlogPost, BlogFilters } from '../lib/api/blog'
import { getUserSubscription } from '../lib/api/subscriptions'
import type { BlogPost } from '../lib/api/blog'

export function useBlogPosts(filters: BlogFilters = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [JSON.stringify(filters)])

  const loadPosts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Get user subscription if authenticated
      const { data: { user } } = await (await import('../lib/supabase')).supabase.auth.getUser()
      let subscription = null
      if (user) {
        const subResult = await getUserSubscription(user.id)
        if (subResult.success) {
          subscription = subResult.data
        }
      }

      const result = await getBlogPosts(filters, subscription as any)
      if (result.success) {
        setPosts(result.data || [])
      } else {
        setError(result.error || 'Failed to load posts')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { posts, loading, error, refresh: loadPosts }
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requiresSubscription, setRequiresSubscription] = useState(false)

  useEffect(() => {
    loadPost()
  }, [slug])

  const loadPost = async () => {
    setLoading(true)
    setError(null)
    setRequiresSubscription(false)
    
    try {
      // Get user subscription if authenticated
      const { data: { user } } = await (await import('../lib/supabase')).supabase.auth.getUser()
      let subscription = null
      if (user) {
        const subResult = await getUserSubscription(user.id)
        if (subResult.success) {
          subscription = subResult.data
        }
      }

      const result = await getBlogPost(slug, subscription as any)
      if (result.success) {
        setPost(result.data)
      } else {
        if (result.requiresSubscription) {
          setRequiresSubscription(true)
        }
        setError(result.error || 'Failed to load post')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { post, loading, error, requiresSubscription, refresh: loadPost }
}





