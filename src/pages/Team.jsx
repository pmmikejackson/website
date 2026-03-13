import { useEffect, useState } from 'react'
import { getTeamMembers, getStrapiMedia } from '../lib/strapi'
import ScrollReveal from '../components/ScrollReveal'

const container = { maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem 2rem' }

export default function Team({ theme }) {
  const [members, setMembers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTeamMembers()
      .then(setMembers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={container}>
      <p style={{ color: theme.muted }}>Loading...</p>
    </div>
  )

  if (error) return (
    <div style={container}>
      <p style={{ color: '#ef4444' }}>Failed to load: {error}</p>
    </div>
  )

  return (
    <div style={container}>
      <ScrollReveal>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Team</h1>
        <p style={{ color: theme.muted, marginBottom: '2.5rem', fontSize: '1.1rem' }}>The people behind the projects.</p>
      </ScrollReveal>
      {members.length === 0 && <p style={{ color: theme.muted }}>No team members yet.</p>}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
      }}>
        {members.map((member, i) => {
          const { name, role, bio, photo } = member
          const photoUrl = getStrapiMedia(photo?.url)
          return (
            <ScrollReveal key={member.id} delay={i * 0.1} direction="up">
              <div style={{
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: theme.shadow,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = theme.shadowHover }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = theme.shadow }}
              >
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt={name}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '1.25rem',
                      border: `3px solid ${theme.accentLight}`,
                    }}
                  />
                )}
                <h2 style={{ fontSize: '1.15rem', marginBottom: '0.3rem', fontWeight: 700 }}>{name}</h2>
                {role && <p style={{ color: theme.accent, fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 500 }}>{role}</p>}
                {bio && <p style={{ color: theme.muted, fontSize: '0.9rem', lineHeight: 1.6 }}>{bio}</p>}
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </div>
  )
}
