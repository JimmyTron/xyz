import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Portfolio.css'

interface Project {
  id: number
  title: string
  category: string
  description: string
  shortDescription: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  features: string[]
  mockups?: {
    desktop?: string
    mobile?: string
    tablet?: string
  }
}

const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Full-Stack',
    shortDescription: 'Modern shopping experience with real-time inventory',
    description: 'A comprehensive e-commerce platform built with React and Node.js, featuring real-time inventory management, secure payment processing, and an intuitive admin dashboard.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker'],
    liveUrl: '#',
    githubUrl: '#',
    features: [
      'Real-time inventory synchronization',
      'Secure payment gateway integration',
      'Advanced search and filtering',
      'Responsive admin dashboard',
      'Order tracking system'
    ]
  },
  {
    id: 2,
    title: 'Task Management App',
    category: 'Web App',
    shortDescription: 'Collaborative project management tool',
    description: 'A powerful task management application with team collaboration features, real-time updates, and comprehensive analytics dashboard.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    technologies: ['TypeScript', 'React', 'Supabase', 'TailwindCSS'],
    liveUrl: '#',
    githubUrl: '#',
    features: [
      'Real-time collaboration',
      'Kanban board view',
      'Time tracking',
      'Team analytics',
      'Custom workflows'
    ]
  },
  {
    id: 3,
    title: 'Cloud Infrastructure',
    category: 'DevOps',
    shortDescription: 'Automated CI/CD pipeline with Kubernetes',
    description: 'Scalable cloud infrastructure setup with automated deployment pipelines, container orchestration, and comprehensive monitoring solutions.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    technologies: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins'],
    liveUrl: '#',
    githubUrl: '#',
    features: [
      'Auto-scaling infrastructure',
      'Zero-downtime deployments',
      'Comprehensive monitoring',
      'Cost optimization',
      'Disaster recovery'
    ]
  },
  {
    id: 4,
    title: 'Analytics Dashboard',
    category: 'Data Visualization',
    shortDescription: 'Real-time business intelligence platform',
    description: 'Interactive analytics dashboard providing real-time insights with custom visualizations and predictive analytics capabilities.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
    liveUrl: '#',
    githubUrl: '#',
    features: [
      'Real-time data streaming',
      'Custom chart builder',
      'Predictive analytics',
      'Automated reports',
      'Multi-tenant support'
    ]
  },
  {
    id: 5,
    title: 'Mobile Fitness App',
    category: 'Mobile',
    shortDescription: 'AI-powered workout tracking application',
    description: 'Cross-platform fitness application with AI-powered workout recommendations, progress tracking, and social features.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'TensorFlow'],
    liveUrl: '#',
    githubUrl: '#',
    features: [
      'AI workout recommendations',
      'Progress tracking',
      'Social challenges',
      'Nutrition logging',
      'Wearable integration'
    ]
  },
  {
    id: 6,
    title: 'API Gateway',
    category: 'Backend',
    shortDescription: 'Microservices architecture with GraphQL',
    description: 'High-performance API gateway handling microservices communication with advanced caching and rate limiting.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    technologies: ['GraphQL', 'Node.js', 'Redis', 'Docker', 'Kong'],
    liveUrl: '#',
    githubUrl: '#',
    features: [
      'GraphQL federation',
      'Advanced caching',
      'Rate limiting',
      'API versioning',
      'Real-time subscriptions'
    ]
  }
]

export default function Portfolio() {
  const navigate = useNavigate()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  return (
    <div className="portfolio-page">
      {/* Header */}
      <header className="portfolio-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
          <span>BACK</span>
        </button>
        <div className="portfolio-header-content">
          <h1>PORTFOLIO</h1>
          <p>Featured Projects • Web Development • Cloud Solutions</p>
        </div>
      </header>

      <div className="portfolio-container">
        {/* Intro Section */}
        <section className="portfolio-intro">
          <div className="intro-graphic">
            <div className="graphic-shape"></div>
            <div className="graphic-text">CREATIVE</div>
          </div>
          <div className="intro-content">
            <h2>WHAT I BUILD</h2>
            <p>
              Explore my latest projects in web development, software engineering, and DevOps solutions. From modern web applications to scalable infrastructure, see how I make IT happen.
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="projects-section">
          <div className="section-header">
            <h3>FEATURED PROJECTS</h3>
            <div className="header-accent"></div>
          </div>
          
          <div className="projects-grid">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="project-card"
                onClick={() => handleProjectClick(project)}
              >
                <div className="project-image-wrapper">
                  <img src={project.image} alt={project.title} className="project-image" />
                  <div className="project-overlay">
                    <i className="fas fa-plus-circle"></i>
                  </div>
                </div>
                <div className="project-info">
                  <span className="project-category">{project.category}</span>
                  <h4 className="project-title">{project.title}</h4>
                  <p className="project-description">{project.shortDescription}</p>
                  <div className="project-tech">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="portfolio-cta">
          <div className="cta-content">
            <h3>INTERESTED IN COLLABORATION?</h3>
            <p>Let's work together to bring your ideas to life</p>
            <button className="btn-contact" onClick={() => navigate('/')}>
              GET IN TOUCH
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="cta-graphic">
            <div className="cta-shape"></div>
          </div>
        </section>
      </div>

      {/* Project Modal */}
      {isModalOpen && selectedProject && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-body">
              <div className="modal-left">
                <div className="project-modal-header">
                  <span className="modal-category">{selectedProject.category}</span>
                  <h2>{selectedProject.title}</h2>
                  <p className="modal-description">{selectedProject.description}</p>
                </div>

                <div className="project-features">
                  <h4>KEY FEATURES</h4>
                  <ul>
                    {selectedProject.features.map((feature, idx) => (
                      <li key={idx}>
                        <i className="fas fa-check-circle"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="project-technologies">
                  <h4>TECHNOLOGIES USED</h4>
                  <div className="tech-list">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-item">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="project-actions">
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} className="btn-project-link" target="_blank" rel="noopener noreferrer">
                      <i className="fas fa-external-link-alt"></i>
                      LIVE DEMO
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a href={selectedProject.githubUrl} className="btn-project-link btn-github" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-github"></i>
                      VIEW CODE
                    </a>
                  )}
                </div>
              </div>

              <div className="modal-right">
                <div className="project-showcase">
                  <div className="showcase-main">
                    <img src={selectedProject.image} alt={selectedProject.title} />
                  </div>
                  <div className="showcase-devices">
                    <div className="device-mockup desktop">
                      <div className="device-screen">
                        <img src={selectedProject.image} alt="Desktop view" />
                      </div>
                    </div>
                    <div className="device-mockup mobile">
                      <div className="device-screen">
                        <img src={selectedProject.image} alt="Mobile view" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-left">
            <div className="footer-language">
              <span>EN</span>
              <i className="fas fa-chevron-down"></i>
            </div>
            <div className="footer-social">
              <a href="#" className="footer-social-icon" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="X">
                <i className="fa-brands fa-x"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="Medium">
                <i className="fab fa-medium"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="Hashnode">
                <i className="fab fa-hashnode"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="Email">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
          <div className="footer-platforms">
            <span>WEB</span>
            <span>MOBILE</span>
            <span>CLOUD</span>
            <span>DEVOPS</span>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} Jimmy Tron. All rights reserved.</p>
            <p>Make IT Happen</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
