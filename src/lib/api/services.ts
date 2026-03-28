/**
 * Services API Functions
 * 
 * Handles all services CRUD operations.
 */

import { supabase } from '../supabase'

export interface Service {
  id?: string
  title: string
  description?: string
  icon?: string
  order_index: number
  created_at?: string
  updated_at?: string
}

/**
 * Get all services
 * Public: Returns all services
 */
export async function getServices() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    console.error('Error fetching services:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch services'
    }
  }
}

/**
 * Create a new service
 * Admin only
 */
export async function createService(serviceData: Partial<Service>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error creating service:', error)
    return {
      success: false,
      error: error.message || 'Failed to create service'
    }
  }
}

/**
 * Update a service
 * Admin only
 */
export async function updateService(id: string, serviceData: Partial<Service>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error updating service:', error)
    return {
      success: false,
      error: error.message || 'Failed to update service'
    }
  }
}

/**
 * Delete a service
 * Admin only
 */
export async function deleteService(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw error

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Error deleting service:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete service'
    }
  }
}





