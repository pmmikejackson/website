import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav({ theme, darkMode, setDarkMode }) {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkStyle = (path) => ({
    color: pathname === path ? theme.accent : theme.muted,
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: pathname === path ? 600 : 400,
    transition: 'color 0.2s ease',
    letterSpacing: '0.01em',
  })

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'center',
      padding: scrolled ? '0.75rem 2rem' : '1.25rem 2rem',
      background: scrolled
        ? (darkMode ? 'rgba(17,17,20,0.85)' : 'rgba(254,254,254,0.85)')
        : 'transparent',
      backdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
      borderBottom: scrolled ? `1px solid ${theme.border}` : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1100px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            color: theme.text,
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}>
            MJ
          </Link>
          <Link to="/blog" style={linkStyle('/blog')}>Blog</Link>
          <Link to="/team" style={linkStyle('/team')}>Team</Link>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            background: theme.accentLight,
            border: 'none',
            color: theme.text,
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500,
            transition: 'background 0.2s ease',
          }}
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  )
}
