import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPage, getStrapiMedia } from '../lib/strapi'
import { containerStyle } from '../lib/styles'
import RichText from '../components/RichText'

export default function Page({ theme }) {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setData(null)
    getPage(slug)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div style={containerStyle}><p style={{ color: theme.muted }}>Loading...</p></div>
  if (error) return <div style={containerStyle}><p style={{ color: '#ef4444' }}>Failed to load: {error}</p></div>
  if (!data) return (
    <div style={containerStyle}>
      <p style={{ color: theme.muted }}>Page not found.</p>
      <Link to="/" style={{ color: theme.accent }}>Back to Home</Link>
    </div>
  )

  const heroUrl = data.HeroImage?.url ? getStrapiMedia(data.HeroImage.url) : null

  return (
    <div style={containerStyle}>
      <Link to="/" style={{ color: theme.muted, textDecoration: 'none', fontSize: '0.9rem' }}>← Home</Link>
      <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1rem' }}>{data.Title}</h1>
      {heroUrl && (
        <img
          src={heroUrl}
          alt={data.Title}
          style={{ width: '100%', borderRadius: '8px', marginBottom: '2rem', maxHeight: '500px', objectFit: 'cover' }}
        />
      )}
      <RichText blocks={data.Content} theme={theme} />
    </div>
  )
}
