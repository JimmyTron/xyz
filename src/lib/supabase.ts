import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for contact submissions
export interface ContactSubmission {
  id?: string
  request_type: 'virtual-call' | 'task-request'
  email: string
  name?: string
  message?: string
  status?: 'pending' | 'read' | 'replied' | 'archived'
  created_at?: string
  updated_at?: string
}

// Function to submit contact form
export async function submitContactForm(data: {
  requestType: 'virtual-call' | 'task-request'
  email: string
  name: string
  message: string
}) {
  try {
    // Transform camelCase to snake_case for database
    // Only include optional fields if they have values
    const trimmedName = data.name.trim()
    const trimmedMessage = data.message.trim()
    
    const submissionData: ContactSubmission = {
      request_type: data.requestType,
      email: data.email.trim(),
      ...(trimmedName && { name: trimmedName }),
      ...(trimmedMessage && { message: trimmedMessage }),
    }

    // Insert into Supabase
    // Note: We don't use .select() here because anonymous users can't SELECT
    // due to RLS policies. The insert will succeed but we can't return the data.
    const { error } = await supabase
      .from('contact_submissions')
      .insert([submissionData])

    if (error) {
      throw error
    }

    // Return success without the inserted data (anon users can't SELECT)
    return { success: true, data: null }
  } catch (error: any) {
    console.error('Error submitting contact form:', error)
    return {
      success: false,
      error: error.message || 'Failed to submit form. Please try again.',
    }
  }
}
