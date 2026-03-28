/**
 * Skills API Functions
 * 
 * Handles all skills and skill categories CRUD operations.
 */

import { supabase } from '../supabase'

export interface Skill {
  id?: string
  name: string
  icon?: string
  color?: string
  category?: string
  order_index: number
  created_at?: string
  updated_at?: string
}

export interface SkillCategory {
  id?: string
  title: string
  order_index: number
  created_at?: string
}

export interface SkillsByCategory {
  category: SkillCategory
  skills: Skill[]
}

/**
 * Get all skills grouped by category
 * Public: Returns all skills organized by category
 */
export async function getSkills() {
  try {
    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('skill_categories')
      .select('*')
      .order('order_index', { ascending: true })

    if (categoriesError) throw categoriesError

    // Get all skills
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true })

    if (skillsError) throw skillsError

    // Group skills by category
    const skillsByCategory: SkillsByCategory[] = (categories || []).map(category => ({
      category,
      skills: (skills || []).filter(skill => skill.category === category.id)
    }))

    // Add uncategorized skills
    const uncategorizedSkills = (skills || []).filter(skill => !skill.category)
    if (uncategorizedSkills.length > 0) {
      skillsByCategory.push({
        category: {
          id: 'uncategorized',
          title: 'Other',
          order_index: 999,
          created_at: new Date().toISOString()
        },
        skills: uncategorizedSkills
      })
    }

    return {
      success: true,
      data: skillsByCategory
    }
  } catch (error: any) {
    console.error('Error fetching skills:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch skills'
    }
  }
}

/**
 * Get all skill categories
 * Public: Returns all categories
 */
export async function getSkillCategories() {
  try {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    console.error('Error fetching skill categories:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch skill categories'
    }
  }
}

/**
 * Create a new skill
 * Admin only
 */
export async function createSkill(skillData: Partial<Skill>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('skills')
      .insert([skillData])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error creating skill:', error)
    return {
      success: false,
      error: error.message || 'Failed to create skill'
    }
  }
}

/**
 * Update a skill
 * Admin only
 */
export async function updateSkill(id: string, skillData: Partial<Skill>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('skills')
      .update(skillData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error updating skill:', error)
    return {
      success: false,
      error: error.message || 'Failed to update skill'
    }
  }
}

/**
 * Delete a skill
 * Admin only
 */
export async function deleteSkill(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)

    if (error) throw error

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Error deleting skill:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete skill'
    }
  }
}





