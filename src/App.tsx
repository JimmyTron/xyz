import './App.css'

interface ContentBlock {
  id: string
  title: string
  description: string
  ctaText: string
  ctaIcon: string
  align: 'left' | 'right'
  graphic: string
}

const contentBlocks: ContentBlock[] = [
  {
    id: 'portfolio',
    title: 'VIEW MY PORTFOLIO',
    description: 'Explore my latest projects in web development, software engineering, and DevOps solutions. From modern web applications to scalable infrastructure, see how I make IT happen.',
    ctaText: 'VIEW PROJECTS',
    ctaIcon: 'fas fa-code',
    align: 'left',
    graphic: 'JT'
  },
  {
    id: 'services',
    title: 'MY SERVICES',
    description: 'Specializing in full-stack web development, enterprise software solutions, and DevOps automation. I deliver robust, scalable, and high-performance IT solutions tailored to your needs.',
    ctaText: 'LEARN MORE',
    ctaIcon: 'fas fa-laptop-code',
    align: 'right',
    graphic: 'DEV'
  },
  {
    id: 'skills',
    title: 'TECHNICAL SKILLS',
    description: 'Proficient in modern technologies including React, Node.js, TypeScript, Python, Docker, Kubernetes, AWS, and CI/CD pipelines. Ready to tackle complex technical challenges.',
    ctaText: 'SEE SKILLS',
    ctaIcon: 'fas fa-server',
    align: 'left',
    graphic: 'SKILLS'
  },
  {
    id: 'contact',
    title: 'LET\'S CONNECT',
    description: 'Looking for an IT professional to bring your project to life? Let\'s discuss how I can help you achieve your technology goals and make IT happen for your business.',
    ctaText: 'CONTACT NOW',
    ctaIcon: 'fas fa-envelope',
    align: 'right',
    graphic: 'HI'
  }
]

interface SocialLink {
  icon: string
  url: string
  label: string
}

const socialLinks: SocialLink[] = [
  { icon: 'fab fa-github', url: '#', label: 'GitHub' },
  { icon: 'fab fa-linkedin', url: '#', label: 'LinkedIn' },
  { icon: 'fab fa-twitter', url: '#', label: 'Twitter' },
  { icon: 'fas fa-envelope', url: '#', label: 'Email' },
]

function App() {
  const handleCTAClick = (blockId: string) => {
    console.log(`CTA clicked for ${blockId}`)
  }

  const handleHireNow = () => {
    console.log('Hire Now clicked')
  }

  const handleDownloadCV = () => {
    console.log('Download CV clicked')
  }

  return (
    <div className="app">
      {/* Header Section */}
      <header className="header">
        <div className="header-left">
          <div className="logo">JIMMY TRON</div>
          <div className="tagline-header">MAKE IT HAPPEN</div>
        </div>
        <div className="header-right">
          <button className="btn-hire" onClick={handleHireNow}>
            LET'S GET TO WORK
            <i className="fas fa-arrow-right"></i>
          </button>
          <div className="availability">Hello World</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="tech-grid"></div>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">THE IT GUY</h1>
            <p className="hero-subtitle">Software Developer • DevOps Engineer</p>
            <button className="btn-cv" onClick={handleDownloadCV}>
              CHECK OUT MY WORK
              <i className="fas fa-download"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Platform Logos */}
      <section className="platforms">
        <div className="platform-logos">
          <span>GitHub</span>
          <span>LinkedIn</span>
          <span>Portfolio</span>
          <span>Resume</span>
          <span>Contact</span>
        </div>
      </section>

      {/* Content Blocks */}
      <main className="content-blocks">
        {contentBlocks.map((block) => (
          <section key={block.id} className={`content-block ${block.align}`}>
            {block.align === 'left' ? (
              <>
                <div className="block-cta-box">
                  <div className="cta-graphic">{block.graphic}</div>
                  <div className="cta-title">{block.title}</div>
                  <button 
                    className="btn-cta" 
                    onClick={() => handleCTAClick(block.id)}
                  >
                    {block.ctaText}
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
                <div className="block-content">
                  <div className="content-image">
                    <div className="image-placeholder">
                      <i className={block.ctaIcon}></i>
                    </div>
                  </div>
                  <div className="content-text">
                    <h2>{block.title}</h2>
                    <p>{block.description}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="block-content">
                  <div className="content-image">
                    <div className="image-placeholder">
                      <i className={block.ctaIcon}></i>
                    </div>
                  </div>
                  <div className="content-text">
                    <h2>{block.title}</h2>
                    <p>{block.description}</p>
                  </div>
                </div>
                <div className="block-cta-box">
                  <div className="cta-graphic">{block.graphic}</div>
                  <div className="cta-title">{block.title}</div>
                  <button 
                    className="btn-cta" 
                    onClick={() => handleCTAClick(block.id)}
                  >
                    {block.ctaText}
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </>
            )}
          </section>
        ))}
      </main>

      {/* Social Section */}
      <section className="social-section">
        <div className="social-icons">
          {socialLinks.map((social, index) => (
            <a 
              key={index}
              href={social.url} 
              className="social-icon"
              aria-label={social.label}
            >
              <i className={social.icon}></i>
            </a>
          ))}
        </div>
        <div className="social-text">
          <h2>GET MORE FROM JIMMY TRON</h2>
          <p>Connect with me on social media for the latest updates, tech insights, and project showcases. Follow along as I continue to make IT happen.</p>
        </div>
        <div className="social-cta-box">
          <div className="cta-graphic">JT</div>
          <div className="cta-title">ENGAGE MORE</div>
          <button className="btn-cta" onClick={() => handleCTAClick('social')}>
            FOLLOW NOW
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-language">
            <span>ENGLISH</span>
            <i className="fas fa-chevron-down"></i>
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

export default App
