/**
 * Admin Layout Component
 * 
 * Protected layout for admin dashboard with authentication check.
 */

import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './AdminLayout.css'

export default function AdminLayout() {
  const navigate = useNavigate()
  const { user, loading, isAdmin, signOut } = useAuth()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading) {
        if (!user) {
          navigate('/admin/login')
          return
        }
        if (!isAdmin) {
          navigate('/')
          return
        }
        setChecking(false)
      }
    }
    checkAccess()
  }, [user, loading, isAdmin, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading || checking) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>ADMIN DASHBOARD</h1>
        </div>
        <div className="admin-header-right">
          {user && (
            <div className="admin-user">
              <span>{user.email}</span>
              <button onClick={handleSignOut} className="btn-signout">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="admin-container">
        <nav className="admin-sidebar">
          <a href="/admin" className="nav-item">
            <i className="fas fa-dashboard"></i>
            <span>Dashboard</span>
          </a>
          <a href="/admin/blog" className="nav-item">
            <i className="fas fa-blog"></i>
            <span>Blog</span>
          </a>
          <a href="/admin/portfolio" className="nav-item">
            <i className="fas fa-briefcase"></i>
            <span>Portfolio</span>
          </a>
          <a href="/admin/services" className="nav-item">
            <i className="fas fa-cogs"></i>
            <span>Services</span>
          </a>
          <a href="/admin/skills" className="nav-item">
            <i className="fas fa-code"></i>
            <span>Skills</span>
          </a>
          <a href="/admin/contact" className="nav-item">
            <i className="fas fa-envelope"></i>
            <span>Contact</span>
          </a>
          <a href="/admin/subscriptions" className="nav-item">
            <i className="fas fa-credit-card"></i>
            <span>Subscriptions</span>
          </a>
        </nav>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}





