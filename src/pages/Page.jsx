import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPage, getStrapiMedia } from '../lib/strapi'
import RichText from '../components/RichText'
import ScrollReveal from '../components/ScrollReveal'

const container = { maxWidth: '800px', margin: '0 auto', padding: '6rem 2rem 2rem' }

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

  if (loading) return <div style={container}><p style={{ color: theme.muted }}>Loading...</p></div>
  if (error) return <div style={container}><p style={{ color: '#ef4444' }}>Failed to load: {error}</p></div>
  if (!data) return (
    <div style={container}>
      <p style={{ color: theme.muted }}>Page not found.</p>
      <Link to="/" style={{ color: theme.accent }}>Back to Home</Link>
    </div>
  )

  const heroUrl = data.HeroImage?.url ? getStrapiMedia(data.HeroImage.url) : null

  return (
    <div style={container}>
      <ScrollReveal>
        <Link to="/" style={{ color: theme.muted, textDecoration: 'none', fontSize: '0.9rem' }}>← Home</Link>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1rem', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{data.Title}</h1>
      </ScrollReveal>
      {heroUrl && (
        <ScrollReveal delay={0.1}>
          <img
            src={heroUrl}
            alt={data.Title}
            style={{
              width: '100%',
              borderRadius: '16px',
              marginBottom: '2rem',
              maxHeight: '500px',
              objectFit: 'cover',
              boxShadow: theme.shadow,
            }}
          />
        </ScrollReveal>
      )}
      <ScrollReveal delay={0.2}>
        <RichText blocks={data.Content} theme={theme} />
      </ScrollReveal>
    </div>
  )
}
