import { Link, useLocation } from 'react-router-dom'

export default function Nav({ theme, darkMode, setDarkMode }) {
  const { pathname } = useLocation()

  const linkStyle = (path) => ({
    color: pathname === path ? theme.accent : theme.muted,
    textDecoration: 'none',
    fontSize: '0.95rem',
  })

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 2rem',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: theme.text, textDecoration: 'none' }}>
          MJ
        </Link>
        <Link to="/blog" style={linkStyle('/blog')}>Blog</Link>
        <Link to="/team" style={linkStyle('/team')}>Team</Link>
      </div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          background: 'none',
          border: `1px solid ${theme.border}`,
          color: theme.text,
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        {darkMode ? 'Light' : 'Dark'}
      </button>
    </nav>
  )
}
