/**
 * Subscription Plans Page
 * 
 * Displays available subscription tiers and pricing.
 */

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import './SubscriptionPlans.css'

interface Plan {
  id: 'free' | 'premium' | 'pro'
  name: string
  price: number
  period: string
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    features: [
      'Access to basic blog posts',
      'Portfolio viewing',
      'Services information',
      'Skills showcase',
      'Community support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    period: 'month',
    popular: true,
    features: [
      'Everything in Free',
      'Access to all premium blog posts',
      'Priority support',
      'Exclusive content',
      'Ad-free experience',
      'Early access to new features'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    period: 'month',
    features: [
      'Everything in Premium',
      'API access',
      'Custom integrations',
      'Advanced analytics',
      'Dedicated support',
      'White-label options'
    ]
  }
]

export default function SubscriptionPlans() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { subscription, isPremium, isPro } = useSubscription(user?.id)

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate('/admin?redirect=/subscription-plans')
      return
    }

    if (planId === 'free') {
      // Handle free plan (already active)
      return
    }

    // TODO: Integrate with Stripe checkout
    // For now, show message
    alert(`Stripe checkout integration required for ${planId} plan`)
  }

  const getCurrentPlan = () => {
    if (isPro) return 'pro'
    if (isPremium) return 'premium'
    return 'free'
  }

  const currentPlan = getCurrentPlan()

  return (
    <div className="subscription-plans-page">
      <header className="plans-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
          <span>BACK</span>
        </button>
        <div className="plans-header-content">
          <h1>SUBSCRIPTION PLANS</h1>
          <p>Choose the plan that's right for you</p>
        </div>
      </header>

      <div className="plans-container">
        <div className="plans-grid">
          {plans.map(plan => {
            const isCurrentPlan = currentPlan === plan.id
            const isUpgrade = 
              (plan.id === 'premium' && currentPlan === 'free') ||
              (plan.id === 'pro' && currentPlan !== 'pro')

            return (
              <div
                key={plan.id}
                className={`plan-card ${plan.popular ? 'popular' : ''} ${isCurrentPlan ? 'current' : ''}`}
              >
                {plan.popular && (
                  <div className="popular-badge">MOST POPULAR</div>
                )}
                {isCurrentPlan && (
                  <div className="current-badge">CURRENT PLAN</div>
                )}
                
                <div className="plan-header">
                  <h2>{plan.name}</h2>
                  <div className="plan-price">
                    <span className="price-amount">${plan.price}</span>
                    <span className="price-period">/{plan.period}</span>
                  </div>
                </div>

                <ul className="plan-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn-plan ${isCurrentPlan ? 'btn-current' : isUpgrade ? 'btn-upgrade' : 'btn-select'}`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan
                    ? 'Current Plan'
                    : isUpgrade
                    ? 'Upgrade'
                    : 'Select Plan'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="plans-footer">
          <p>All plans include a 30-day money-back guarantee</p>
          <p>Questions? <a href="/">Contact us</a></p>
        </div>
      </div>
    </div>
  )
}





