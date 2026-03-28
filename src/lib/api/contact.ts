/**
 * Contact API Functions
 * 
 * Handles contact submission management (extends existing functionality).
 */

import { supabase } from '../supabase'
import { ContactSubmission } from '../supabase'

/**
 * Get all contact submissions
 * Admin only
 */
export async function getContactSubmissions() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    console.error('Error fetching contact submissions:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch contact submissions'
    }
  }
}

/**
 * Update contact submission status
 * Admin only
 */
export async function updateSubmissionStatus(
  id: string,
  status: 'pending' | 'read' | 'replied' | 'archived'
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error updating submission status:', error)
    return {
      success: false,
      error: error.message || 'Failed to update submission status'
    }
  }
}

/**
 * Delete a contact submission
 * Admin only
 */
export async function deleteSubmission(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id)

    if (error) throw error

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Error deleting submission:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete submission'
    }
  }
}

// Re-export the existing submitContactForm function
export { submitContactForm } from '../supabase'
export type { ContactSubmission }





