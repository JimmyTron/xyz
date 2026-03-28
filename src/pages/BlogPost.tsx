/**
 * Individual Blog Post Page
 * 
 * Displays a single blog post with view count tracking.
 */

import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBlogPost } from '../hooks/useBlog'
import { PremiumContentGate } from '../components/PremiumContentGate'
import './BlogPost.css'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { post, loading, error, requiresSubscription } = useBlogPost(slug || '')

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="loading">Loading post...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="blog-post-page">
        <div className="error-container">
          <h1>Post Not Found</h1>
          <p>{error || 'The post you're looking for doesn't exist.'}</p>
          <button onClick={() => navigate('/blog')} className="btn-back">
            Back to Blog
          </button>
        </div>
      </div>
    )
  }

  if (requiresSubscription) {
    return (
      <div className="blog-post-page">
        <PremiumContentGate contentId={post.id || ''} />
      </div>
    )
  }

  return (
    <div className="blog-post-page">
      <header className="blog-post-header">
        <button className="btn-back" onClick={() => navigate('/blog')}>
          <i className="fas fa-arrow-left"></i>
          <span>BACK TO BLOG</span>
        </button>
      </header>

      <article className="blog-post-content">
        {post.featured_image && (
          <div className="blog-post-image">
            <img src={post.featured_image} alt={post.title} />
          </div>
        )}

        <div className="blog-post-header-content">
          {post.is_premium && (
            <span className="premium-badge">PREMIUM</span>
          )}
          <h1>{post.title}</h1>
          <div className="blog-post-meta">
            {post.published_at && (
              <span className="date">
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
            <span className="view-count">
              <i className="fas fa-eye"></i> {post.view_count || 0} views
            </span>
          </div>
        </div>

        <div 
          className="blog-post-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  )
}
