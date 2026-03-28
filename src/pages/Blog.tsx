/**
 * Blog Listing Page
 * 
 * Displays all published blog posts with filtering options.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBlogPosts } from '../hooks/useBlog'
import { getBlogCategories, getBlogTags } from '../lib/api/blog'
import type { BlogCategory, BlogTag } from '../lib/api/blog'
import './Blog.css'

export default function Blog() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])

  const filters = {
    category: selectedCategory || undefined,
    tag: selectedTag || undefined,
    search: searchQuery || undefined
  }

  const { posts, loading, error } = useBlogPosts(filters)

  useEffect(() => {
    loadCategories()
    loadTags()
  }, [])

  const loadCategories = async () => {
    const result = await getBlogCategories()
    if (result.success) {
      setCategories(result.data || [])
    }
  }

  const loadTags = async () => {
    const result = await getBlogTags()
    if (result.success) {
      setTags(result.data || [])
    }
  }

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`)
  }

  return (
    <div className="blog-page">
      <header className="blog-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
          <span>BACK</span>
        </button>
        <div className="blog-header-content">
          <h1>BLOG</h1>
          <p>Latest Articles • Tech Insights • Industry News</p>
        </div>
      </header>

      <div className="blog-container">
        {/* Filters */}
        <section className="blog-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="filter-select"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="blog-posts">
          {loading && <div className="loading">Loading posts...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && posts.length === 0 && (
            <div className="no-posts">No posts found.</div>
          )}
          {!loading && !error && posts.length > 0 && (
            <div className="posts-grid">
              {posts.map(post => (
                <article
                  key={post.id}
                  className="blog-card"
                  onClick={() => handlePostClick(post.slug)}
                >
                  {post.featured_image && (
                    <div className="blog-card-image">
                      <img src={post.featured_image} alt={post.title} />
                    </div>
                  )}
                  <div className="blog-card-content">
                    {post.is_premium && (
                      <span className="premium-badge">PREMIUM</span>
                    )}
                    {post.featured && (
                      <span className="featured-badge">FEATURED</span>
                    )}
                    <h2>{post.title}</h2>
                    {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
                    <div className="blog-card-meta">
                      <span className="view-count">
                        <i className="fas fa-eye"></i> {post.view_count || 0}
                      </span>
                      {post.published_at && (
                        <span className="date">
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}





