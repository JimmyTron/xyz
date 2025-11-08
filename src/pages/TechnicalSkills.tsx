import { useNavigate } from 'react-router-dom'
import './TechnicalSkills.css'

interface Skill {
  name: string
  icon: string
  color: string
}

interface SkillCategory {
  title: string
  skills: Skill[]
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend Development',
    skills: [
      { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
      { name: 'TypeScript', icon: 'fab fa-js', color: '#3178C6' },
      { name: 'HTML5', icon: 'fab fa-html5', color: '#E34F26' },
      { name: 'CSS3', icon: 'fab fa-css3-alt', color: '#1572B6' },
      { name: 'Vite', icon: 'fas fa-bolt', color: '#646CFF' },
    ]
  },
  {
    title: 'Backend Development',
    skills: [
      { name: 'Node.js', icon: 'fab fa-node-js', color: '#339933' },
      { name: 'Python', icon: 'fab fa-python', color: '#3776AB' },
      { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791' },
      { name: 'Supabase', icon: 'fas fa-fire', color: '#3ECF8E' },
      { name: 'Express', icon: 'fas fa-server', color: '#00ff88' },
    ]
  },
  {
    title: 'DevOps & Cloud',
    skills: [
      { name: 'Docker', icon: 'fab fa-docker', color: '#2496ED' },
      { name: 'Kubernetes', icon: 'fas fa-dharmachakra', color: '#326CE5' },
      { name: 'AWS', icon: 'fab fa-aws', color: '#FF9900' },
      { name: 'CI/CD', icon: 'fas fa-circle-notch', color: '#00ff88' },
      { name: 'Git', icon: 'fab fa-git-alt', color: '#F05032' },
    ]
  },
  {
    title: 'Languages',
    skills: [
      { name: 'JavaScript', icon: 'fab fa-js', color: '#F7DF1E' },
      { name: 'TypeScript', icon: 'fas fa-code', color: '#3178C6' },
      { name: 'Python', icon: 'fab fa-python', color: '#3776AB' },
      { name: 'SQL', icon: 'fas fa-database', color: '#00758F' },
      { name: 'Bash', icon: 'fas fa-terminal', color: '#4EAA25' },
    ]
  }
]

const certifications = [
  { name: 'AWS Certified', icon: 'fas fa-certificate', year: '2023' },
  { name: 'React Developer', icon: 'fas fa-graduation-cap', year: '2022' },
  { name: 'DevOps Expert', icon: 'fas fa-award', year: '2023' },
]

export default function TechnicalSkills() {
  const navigate = useNavigate()

  return (
    <div className="technical-skills-page">
      {/* Header */}
      <header className="skills-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
          <span>BACK</span>
        </button>
        <div className="skills-header-content">
          <h1>TECHNICAL SKILLS</h1>
          <p>Full-Stack Development • DevOps • Cloud Infrastructure</p>
        </div>
      </header>

      <div className="skills-container">
        {/* Profile Summary */}
        <section className="profile-summary">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
          <div className="profile-info">
            <h2>JIMMY TRON</h2>
            <p className="profile-title">Full-Stack Developer • DevOps Engineer</p>
            <p className="profile-description">
              Experienced IT professional specializing in modern web technologies, 
              cloud infrastructure, and scalable solutions. Passionate about building 
              robust applications and automating workflows.
            </p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-value">50+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-value">100%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Grid */}
        <div className="skills-grid">
          {skillCategories.map((category, idx) => (
            <section key={idx} className="skill-category-card">
              <h3 className="category-title">{category.title}</h3>
              <div className="skills-list">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx} className="skill-badge">
                    <i 
                      className={skill.icon} 
                      style={{ color: skill.color }}
                    ></i>
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Certifications */}
        <section className="certifications-card">
          <h3 className="category-title">Certifications & Awards</h3>
          <div className="certifications-list">
            {certifications.map((cert, idx) => (
              <div key={idx} className="certification-item">
                <i className={cert.icon}></i>
                <div className="cert-info">
                  <span className="cert-name">{cert.name}</span>
                  <span className="cert-year">{cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Highlights */}
        <section className="experience-card">
          <h3 className="category-title">Key Expertise</h3>
          <div className="expertise-list">
            <div className="expertise-item">
              <i className="fas fa-code"></i>
              <div>
                <h4>Full-Stack Development</h4>
                <p>Building modern web applications with React, Node.js, and TypeScript</p>
              </div>
            </div>
            <div className="expertise-item">
              <i className="fas fa-cloud"></i>
              <div>
                <h4>Cloud & DevOps</h4>
                <p>Deploying scalable infrastructure with Docker, Kubernetes, and AWS</p>
              </div>
            </div>
            <div className="expertise-item">
              <i className="fas fa-database"></i>
              <div>
                <h4>Database Management</h4>
                <p>Designing efficient databases with PostgreSQL and implementing RLS</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tools & Technologies */}
        <section className="tools-card">
          <h3 className="category-title">Daily Tools</h3>
          <div className="tools-grid">
            <div className="tool-item">
              <i className="fab fa-github"></i>
              <span>GitHub</span>
            </div>
            <div className="tool-item">
              <i className="fas fa-code-branch"></i>
              <span>VS Code</span>
            </div>
            <div className="tool-item">
              <i className="fab fa-linux"></i>
              <span>Linux</span>
            </div>
            <div className="tool-item">
              <i className="fab fa-npm"></i>
              <span>NPM</span>
            </div>
            <div className="tool-item">
              <i className="fas fa-terminal"></i>
              <span>Terminal</span>
            </div>
            <div className="tool-item">
              <i className="fab fa-slack"></i>
              <span>Slack</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

