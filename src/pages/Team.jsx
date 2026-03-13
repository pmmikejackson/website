import { useEffect, useState } from 'react'
import { getTeamMembers, getStrapiMedia } from '../lib/strapi'
import { containerStyle } from '../lib/styles'

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

  const mutedStyle = { color: theme.muted, fontSize: '0.9rem' }

  if (loading) return (
    <div style={containerStyle}>
      <p style={mutedStyle}>Loading...</p>
    </div>
  )

  if (error) return (
    <div style={containerStyle}>
      <p style={{ color: '#ef4444' }}>Failed to load: {error}</p>
    </div>
  )

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Team</h1>
      {members.length === 0 && <p style={mutedStyle}>No team members yet.</p>}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
      }}>
        {members.map((member) => {
          const { name, role, bio, photo } = member
          const photoUrl = getStrapiMedia(photo?.url)
          return (
            <div key={member.id} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              {photoUrl && (
                <img
                  src={photoUrl}
                  alt={name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '1rem',
                  }}
                />
              )}
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{name}</h2>
              {role && <p style={{ color: theme.accent, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{role}</p>}
              {bio && <p style={{ color: theme.muted, fontSize: '0.9rem', lineHeight: 1.5 }}>{bio}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
