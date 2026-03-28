/**
 * Portfolio API Functions
 * 
 * Handles all portfolio project CRUD operations.
 */

import { supabase } from '../supabase'

export interface PortfolioProject {
  id?: string
  title: string
  description?: string
  image_url?: string
  technologies?: string[]
  github_url?: string
  live_url?: string
  featured: boolean
  order_index: number
  created_at?: string
  updated_at?: string
}

/**
 * Get all portfolio projects
 * Public: Returns all projects
 */
export async function getPortfolioProjects() {
  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    console.error('Error fetching portfolio projects:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch portfolio projects'
    }
  }
}

/**
 * Get featured portfolio projects
 * Public: Returns featured projects
 */
export async function getFeaturedProjects() {
  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('featured', true)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    console.error('Error fetching featured projects:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch featured projects'
    }
  }
}

/**
 * Create a new portfolio project
 * Admin only
 */
export async function createProject(projectData: Partial<PortfolioProject>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert([projectData])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error creating project:', error)
    return {
      success: false,
      error: error.message || 'Failed to create project'
    }
  }
}

/**
 * Update a portfolio project
 * Admin only
 */
export async function updateProject(id: string, projectData: Partial<PortfolioProject>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('portfolio_projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error updating project:', error)
    return {
      success: false,
      error: error.message || 'Failed to update project'
    }
  }
}

/**
 * Delete a portfolio project
 * Admin only
 */
export async function deleteProject(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Error deleting project:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete project'
    }
  }
}





