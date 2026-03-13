import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Team from './pages/Team'
import Page from './pages/Page'
import ScrollReveal from './components/ScrollReveal'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const theme = {
    bg: darkMode ? '#111114' : '#fefefe',
    text: darkMode ? '#f0f0f0' : '#1a1a2e',
    muted: darkMode ? '#9ca3af' : '#6b7280',
    accent: darkMode ? '#818cf8' : '#6366f1',
    accentLight: darkMode ? 'rgba(129,140,248,0.12)' : 'rgba(99,102,241,0.08)',
    cardBg: darkMode ? '#1e1e24' : '#ffffff',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    heroBg: darkMode ? '#16161a' : '#f8f7ff',
    gradient: darkMode
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadow: darkMode
      ? '0 4px 24px rgba(0,0,0,0.4)'
      : '0 4px 24px rgba(0,0,0,0.06)',
    shadowHover: darkMode
      ? '0 8px 32px rgba(0,0,0,0.5)'
      : '0 8px 32px rgba(0,0,0,0.1)',
  }

  return (
    <BrowserRouter>
      <div style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: theme.bg,
        color: theme.text,
        minHeight: '100vh',
        transition: 'background 0.4s ease, color 0.4s ease',
        overflowX: 'hidden',
      }}>
        <Nav theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />

        <Routes>
          <Route path="/" element={<Home theme={theme} darkMode={darkMode} />} />
          <Route path="/blog" element={<Blog theme={theme} />} />
          <Route path="/blog/:slug" element={<Blog theme={theme} />} />
          <Route path="/team" element={<Team theme={theme} />} />
          <Route path="/pages/:slug" element={<Page theme={theme} />} />
          <Route path="*" element={
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem', textAlign: 'center' }}>
              <ScrollReveal>
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.2 }}>404</h1>
                <p style={{ fontSize: '1.2rem', color: theme.muted, marginBottom: '2rem' }}>This page doesn't exist.</p>
                <Link to="/" style={{
                  color: '#fff',
                  background: theme.gradient,
                  padding: '0.75rem 2rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  display: 'inline-block',
                }}>Back to Home</Link>
              </ScrollReveal>
            </div>
          } />
        </Routes>

        <footer style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '4rem 2rem 3rem',
          textAlign: 'center',
          color: theme.muted,
          fontSize: '0.85rem',
          borderTop: `1px solid ${theme.border}`,
        }}>
          Self-hosted on a Synology NAS. Because why not.
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
