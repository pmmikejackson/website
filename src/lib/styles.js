export const containerStyle = { maxWidth: '900px', margin: '0 auto', padding: '2rem' }

export const categoryBadge = (accent) => ({
  fontSize: '0.75rem',
  color: accent,
  border: `1px solid ${accent}`,
  padding: '0.15rem 0.5rem',
  borderRadius: '12px',
})

export const linkButtonStyle = (accent) => ({
  background: 'none',
  border: 'none',
  color: accent,
  textDecoration: 'none',
  cursor: 'pointer',
  padding: 0,
  fontSize: 'inherit',
})
