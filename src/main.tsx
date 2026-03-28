import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import TechnicalSkills from './pages/TechnicalSkills.tsx'
import Portfolio from './pages/Portfolio.tsx'
import Blog from './pages/Blog.tsx'
import BlogPost from './pages/BlogPost.tsx'
import SubscriptionPlans from './pages/SubscriptionPlans.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/skills" element={<TechnicalSkills />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/subscription-plans" element={<SubscriptionPlans />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

