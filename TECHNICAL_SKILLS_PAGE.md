# Technical Skills Page

## Overview

Created a dedicated technical skills page with a portfolio-style layout that maintains the green-black color scheme from the main site.

## Features

### Navigation
- **Route:** `/skills`
- **Access:** Click "SEE SKILLS" button on the main page
- **Back Button:** Returns to main page with animated transition

### Page Sections

#### 1. **Profile Summary**
- Avatar placeholder with green accent
- Professional title and description
- Statistics: Years of experience, projects, satisfaction rate
- Responsive grid layout

#### 2. **Skill Categories** (4 Cards)
- **Frontend Development:** React, TypeScript, HTML5, CSS3, Vite
- **Backend Development:** Node.js, Python, PostgreSQL, Supabase, Express
- **DevOps & Cloud:** Docker, Kubernetes, AWS, CI/CD, Git
- **Languages:** JavaScript, TypeScript, Python, SQL, Bash

Each skill badge has:
- Colored icon
- Hover effects (lift + glow)
- Click interactions

#### 3. **Certifications & Awards**
- 3-column grid layout
- Icon + name + year
- Hover effects with green glow

#### 4. **Key Expertise**
- Full-Stack Development
- Cloud & DevOps
- Database Management
- Icon + description format

#### 5. **Daily Tools**
- 6-column grid
- GitHub, VS Code, Linux, NPM, Terminal, Slack
- Icon + label format

## Design System

### Colors
```css
--bg-primary: #0a0a0a
--bg-secondary: #1a1a1a
--accent-green: #00ff88
--text-primary: #ffffff
--text-secondary: #b0b0b0
--border: rgba(0, 255, 136, 0.2)
```

### Components

#### Cards
- Background: `#1a1a1a`
- Border: `2px solid rgba(0, 255, 136, 0.2)`
- Border Radius: `12px`
- Padding: `2.5rem`
- Hover: Border brightens, lifts, adds shadow

#### Skill Badges
- Background: `rgba(0, 255, 136, 0.05)`
- Border: `2px solid rgba(0, 255, 136, 0.2)`
- Hover: Lift + border glow effect

#### Buttons
- Back button: Transparent with green border
- Hover: Slides left + background fade

### Typography
- Headers: 900 weight, uppercase, letter-spacing
- Titles: 700 weight
- Body: 400 weight, 1.6 line-height

### Animations
- Page load: Slide up
- Hover: Transform translateY(-5px)
- Scale in: For icons
- Smooth transitions: 0.3s ease

## Responsive Design

### Desktop (>1024px)
- 2-column skill grid
- 6-column tools grid
- Full-width profile

### Tablet (768-1024px)
- 1-column skill grid
- 3-column tools grid
- Stacked profile

### Mobile (<768px)
- Single column
- 2-column tools grid
- Smaller typography

## File Structure

```
src/
├── pages/
│   ├── TechnicalSkills.tsx    # Main component
│   └── TechnicalSkills.css    # Styles
├── App.tsx                     # Updated with navigation
└── main.tsx                    # Router setup
```

## Technologies Used

- **React Router DOM:** Client-side routing
- **TypeScript:** Type safety
- **CSS3:** Animations and grid layouts
- **Font Awesome:** Icons

## Customization

### Adding Skills
Edit `skillCategories` array in `TechnicalSkills.tsx`:

```typescript
{
  title: 'Category Name',
  skills: [
    { name: 'Skill Name', icon: 'fas fa-icon', color: '#hexcolor' }
  ]
}
```

### Adding Certifications
Edit `certifications` array:

```typescript
{ name: 'Cert Name', icon: 'fas fa-icon', year: '2024' }
```

### Changing Colors
Update CSS variables in `TechnicalSkills.css`

## Deployment Notes

- React Router requires server-side configuration
- For Vercel: Add `vercel.json` with rewrites
- For Netlify: Add `_redirects` file
- Build output includes all routes in single bundle

## Future Enhancements

- [ ] Add filtering by category
- [ ] Add skill proficiency levels
- [ ] Add project links for each skill
- [ ] Add certifications modal with details
- [ ] Add skill endorsements/testimonials
- [ ] Add timeline/roadmap visualization
- [ ] Add download CV button
- [ ] Add print-friendly version

