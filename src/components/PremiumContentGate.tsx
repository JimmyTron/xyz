/**
 * Premium Content Gate Component
 * 
 * Displays a gate for premium content requiring subscription.
 */

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './PremiumContentGate.css'

interface PremiumContentGateProps {
  contentId: string
}

export function PremiumContentGate({ contentId }: PremiumContentGateProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleUpgrade = () => {
    navigate('/subscription-plans')
  }

  const handleSignIn = () => {
    navigate('/admin?redirect=/subscription-plans')
  }

  return (
    <div className="premium-gate">
      <div className="premium-gate-content">
        <div className="premium-icon">
          <i className="fas fa-lock"></i>
        </div>
        <h1>Premium Content</h1>
        <p>This content is available exclusively for Premium and Pro subscribers.</p>
        <div className="premium-benefits">
          <h3>Upgrade to unlock:</h3>
          <ul>
            <li><i className="fas fa-check"></i> Access to all premium blog posts</li>
            <li><i className="fas fa-check"></i> Priority support</li>
            <li><i className="fas fa-check"></i> Exclusive content and features</li>
            <li><i className="fas fa-check"></i> Ad-free experience</li>
          </ul>
        </div>
        <div className="premium-actions">
          {user ? (
            <button onClick={handleUpgrade} className="btn-upgrade">
              Upgrade Now
            </button>
          ) : (
            <button onClick={handleSignIn} className="btn-signin">
              Sign In to Upgrade
            </button>
          )}
          <button onClick={() => navigate('/blog')} className="btn-back">
            Back to Blog
          </button>
        </div>
      </div>
    </div>
  )
}





