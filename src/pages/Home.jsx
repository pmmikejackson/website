import { useState } from 'react'

const projects = [
  { title: 'Project One', desc: 'A cool thing I built', tech: 'React, Node.js' },
  { title: 'Project Two', desc: 'Another cool thing', tech: 'Python, Docker' },
  { title: 'Project Three', desc: 'Something experimental', tech: 'Synology, Cloudflare' },
]

export default function Home({ theme }) {
  const [showLinkedIn, setShowLinkedIn] = useState(false)

  return (
    <>
      {/* Hero */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Mike Jackson</h1>
        <p style={{ fontSize: '1.3rem', color: theme.muted, marginBottom: '1rem' }}>
          Builder of things. Starter of projects. Occasional finisher.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="https://github.com" style={{ color: theme.accent, textDecoration: 'none' }}>GitHub</a>
          <button
            onClick={() => setShowLinkedIn(true)}
            style={{ background: 'none', border: 'none', color: theme.accent, textDecoration: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
          >LinkedIn</button>
          <a href="mailto:mike@themikejackson.com" style={{ color: theme.accent, textDecoration: 'none' }}>Email</a>
        </div>
      </section>

      {/* Projects */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
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

      {/* LinkedIn popup */}
      {showLinkedIn && (
        <div
          onClick={() => setShowLinkedIn(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '340px',
              width: '90%',
              textAlign: 'center',
            }}
          >
            <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Connect with me on LinkedIn</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <a
                href="https://www.linkedin.com/in/michael-c-jackson01/"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: theme.accent,
                  color: '#fff',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >Open LinkedIn</a>
              <button
                onClick={() => setShowLinkedIn(false)}
                style={{
                  background: 'none',
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
