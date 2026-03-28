/**
 * Blog API Functions
 * 
 * Handles all blog-related CRUD operations including
 * premium content access control and view tracking.
 */

import { supabase } from '../supabase'

export interface BlogPost {
  id?: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  author_id?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  view_count: number
  seo_title?: string
  seo_description?: string
  is_premium: boolean
  created_at?: string
  updated_at?: string
  published_at?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface BlogFilters {
  category?: string
  tag?: string
  featured?: boolean
  search?: string
  limit?: number
  offset?: number
}

export interface UserSubscription {
  plan_type: 'free' | 'premium' | 'pro'
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
}

/**
 * Get blog posts with optional filters
 * Public: Returns published posts (non-premium or with access)
 */
export async function getBlogPosts(
  filters: BlogFilters = {},
  userSubscription?: UserSubscription | null
) {
  try {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_categories (
          category_id,
          blog_categories (*)
        ),
        blog_post_tags (
          tag_id,
          blog_tags (*)
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    // Apply filters
    if (filters.category) {
      query = query.eq('blog_post_categories.category_id', filters.category)
    }

    if (filters.tag) {
      query = query.eq('blog_post_tags.tag_id', filters.tag)
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
    }

    // Limit and offset
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error

    // Filter premium content based on subscription
    if (data) {
      const hasAccess = userSubscription?.plan_type === 'premium' || userSubscription?.plan_type === 'pro'
      
      return {
        success: true,
        data: data.filter(post => !post.is_premium || hasAccess)
      }
    }

    return { success: true, data: [] }
  } catch (error: any) {
    console.error('Error fetching blog posts:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch blog posts'
    }
  }
}

/**
 * Get a single blog post by slug
 * Public: Returns published post + increments view count
 */
export async function getBlogPost(
  slug: string,
  userSubscription?: UserSubscription | null
) {
  try {
    // First, get the post
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_categories (
          category_id,
          blog_categories (*)
        ),
        blog_post_tags (
          tag_id,
          blog_tags (*)
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (postError) throw postError
    if (!post) {
      return {
        success: false,
        error: 'Post not found'
      }
    }

    // Check premium access
    if (post.is_premium) {
      const hasAccess = userSubscription?.plan_type === 'premium' || userSubscription?.plan_type === 'pro'
      if (!hasAccess) {
        return {
          success: false,
          error: 'Premium content requires subscription',
          requiresSubscription: true
        }
      }
    }

    // Increment view count (non-blocking)
    incrementViewCount(post.id).catch(console.error)

    return {
      success: true,
      data: post
    }
  } catch (error: any) {
    console.error('Error fetching blog post:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch blog post'
    }
  }
}

/**
 * Get all blog categories
 * Public: Returns all categories
 */
export async function getBlogCategories() {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    console.error('Error fetching blog categories:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch blog categories'
    }
  }
}

/**
 * Get all blog tags
 * Public: Returns all tags
 */
export async function getBlogTags() {
  try {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    console.error('Error fetching blog tags:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch blog tags'
    }
  }
}

/**
 * Create a new blog post
 * Admin only
 */
export async function createBlogPost(postData: Partial<BlogPost>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Set published_at if status is published
    const dataToInsert: any = {
      ...postData,
      author_id: user.id
    }

    if (postData.status === 'published' && !postData.published_at) {
      dataToInsert.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([dataToInsert])
      .select()
      .single()

    if (error) throw error

    // Handle categories and tags if provided
    if (postData.id && data) {
      // Categories and tags will be handled separately via junction tables
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error creating blog post:', error)
    return {
      success: false,
      error: error.message || 'Failed to create blog post'
    }
  }
}

/**
 * Update a blog post
 * Admin only
 */
export async function updateBlogPost(id: string, postData: Partial<BlogPost>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Set published_at if status changed to published
    const dataToUpdate: any = { ...postData }
    
    if (postData.status === 'published' && !postData.published_at) {
      // Check if post was previously unpublished
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('published_at')
        .eq('id', id)
        .single()

      if (!existing?.published_at) {
        dataToUpdate.published_at = new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return {
      success: false,
      error: error.message || 'Failed to update blog post'
    }
  }
}

/**
 * Delete a blog post
 * Admin only
 */
export async function deleteBlogPost(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Error deleting blog post:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete blog post'
    }
  }
}

/**
 * Increment view count for a blog post
 * Public: Can be called by anyone
 */
export async function incrementViewCount(postId: string) {
  try {
    // Insert view record
    await supabase
      .from('blog_post_views')
      .insert([{ post_id: postId }])

    // Increment count using database function
    const { data, error } = await supabase.rpc('increment_blog_post_view_count', {
      post_id: postId
    })

    if (error) throw error

    return {
      success: true,
      viewCount: data
    }
  } catch (error: any) {
    console.error('Error incrementing view count:', error)
    // Don't throw - view tracking is non-critical
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Check if user has premium access to content
 */
export async function checkPremiumAccess(userId: string, contentId: string) {
  try {
    const { data, error } = await supabase.rpc('has_premium_access', {
      user_id: userId,
      content_type: 'blog_post',
      content_id: contentId
    })

    if (error) throw error

    return {
      success: true,
      hasAccess: data || false
    }
  } catch (error: any) {
    console.error('Error checking premium access:', error)
    return {
      success: false,
      hasAccess: false,
      error: error.message
    }
  }
}





