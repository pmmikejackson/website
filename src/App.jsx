import { useState } from 'react'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  const theme = {
    bg: darkMode ? '#0a0a0a' : '#fafafa',
    text: darkMode ? '#ffffff' : '#0a0a0a',
    muted: darkMode ? '#888888' : '#666666',
    accent: darkMode ? '#3b82f6' : '#2563eb',
    cardBg: darkMode ? '#1a1a1a' : '#ffffff',
    border: darkMode ? '#333' : '#e5e5e5',
  }

  const projects = [
    { title: 'Project One', desc: 'A cool thing I built', tech: 'React, Node.js' },
    { title: 'Project Two', desc: 'Another cool thing', tech: 'Python, Docker' },
    { title: 'Project Three', desc: 'Something experimental', tech: 'Synology, Cloudflare' },
  ]

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: theme.bg,
      color: theme.text,
      minHeight: '100vh',
      transition: 'all 0.3s ease',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>MJ</span>
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

      {/* Hero */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '4rem 2rem',
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Mike Jackson</h1>
        <p style={{ fontSize: '1.3rem', color: theme.muted, marginBottom: '1rem' }}>
          Builder of things. Starter of projects. Occasional finisher.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="https://github.com" style={{ color: theme.accent, textDecoration: 'none' }}>GitHub</a>
          <a href="https://www.linkedin.com/in/michael-c-jackson01/" style={{ color: theme.accent, textDecoration: 'none' }}>LinkedIn</a>
          <a href="mailto:mike@themikejackson.com" style={{ color: theme.accent, textDecoration: 'none' }}>Email</a>
        </div>
      </section>

      {/* Projects */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Projects</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
        }}>
          {projects.map((project, i) => (
            <div key={i} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
            }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{project.title}</h3>
              <p style={{ color: theme.muted, marginBottom: '0.5rem' }}>{project.desc}</p>
              <span style={{ fontSize: '0.8rem', color: theme.accent }}>{project.tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '3rem 2rem',
        textAlign: 'center',
        color: theme.muted,
        fontSize: '0.9rem',
      }}>
        Self-hosted on a Synology NAS. Because why not.
      </footer>
    </div>
  )
}

export default App
