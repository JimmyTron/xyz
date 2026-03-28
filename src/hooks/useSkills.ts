/**
 * useSkills Hook
 * 
 * Provides skills data grouped by category.
 */

import { useState, useEffect } from 'react'
import { getSkills, getSkillCategories } from '../lib/api/skills'
import type { SkillsByCategory, SkillCategory } from '../lib/api/skills'

export function useSkills() {
  const [skillsByCategory, setSkillsByCategory] = useState<SkillsByCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getSkills()
      if (result.success) {
        setSkillsByCategory(result.data || [])
      } else {
        setError(result.error || 'Failed to load skills')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { skillsByCategory, loading, error, refresh: loadSkills }
}

export function useSkillCategories() {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getSkillCategories()
      if (result.success) {
        setCategories(result.data || [])
      } else {
        setError(result.error || 'Failed to load skill categories')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { categories, loading, error, refresh: loadCategories }
}





