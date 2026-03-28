/**
 * usePortfolio Hook
 * 
 * Provides portfolio projects data.
 */

import { useState, useEffect } from 'react'
import { getPortfolioProjects, getFeaturedProjects } from '../lib/api/portfolio'
import type { PortfolioProject } from '../lib/api/portfolio'

export function usePortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getPortfolioProjects()
      if (result.success) {
        setProjects(result.data || [])
      } else {
        setError(result.error || 'Failed to load projects')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { projects, loading, error, refresh: loadProjects }
}

export function useFeaturedProjects() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getFeaturedProjects()
      if (result.success) {
        setProjects(result.data || [])
      } else {
        setError(result.error || 'Failed to load featured projects')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { projects, loading, error, refresh: loadProjects }
}





