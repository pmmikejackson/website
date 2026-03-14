import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPosts, getPost, getStrapiMedia } from '../lib/strapi'
import { categoryBadge } from '../lib/styles'
import RichText from '../components/RichText'
import ScrollReveal from '../components/ScrollReveal'

const container = { maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem 2rem' }

export default function Blog({ theme }) {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setData(null)
    const fetchData = slug ? getPost(slug) : getPosts()
    fetchData
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div style={container}><p style={{ color: theme.muted }}>Loading...</p></div>
  if (error) return <div style={container}><p style={{ color: '#ef4444' }}>Failed to load: {error}</p></div>

  if (slug) {
    if (!data) return (
      <div style={container}>
        <p style={{ color: theme.muted }}>Post not found.</p>
        <Link to="/blog" style={{ color: theme.accent }}>Back to Blog</Link>
      </div>
    )

    const imageUrl = data.FeaturedImage?.url ? getStrapiMedia(data.FeaturedImage.url) : null

    return (
      <div style={{ ...container, maxWidth: '800px' }}>
        <ScrollReveal>
          <Link to="/blog" style={{ color: theme.muted, textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Blog</Link>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{data.Title}</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {data.PublishedDate && (
              <span style={{ color: theme.muted, fontSize: '0.9rem' }}>
                {new Date(data.PublishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            {data.Category && (
              <span style={categoryBadge(theme.accent)}>{data.Category}</span>
            )}
          </div>
        </ScrollReveal>
        {imageUrl && (
          <ScrollReveal delay={0.1}>
            <img src={imageUrl} alt={data.Title} style={{
              width: '100%',
              borderRadius: '16px',
              marginBottom: '2rem',
              maxHeight: '400px',
              objectFit: 'cover',
              boxShadow: theme.shadow,
            }} />
          </ScrollReveal>
        )}
        <ScrollReveal delay={0.2}>
          <RichText blocks={data.Body} theme={theme} />
        </ScrollReveal>
      </div>
    )
  }

  return (
    <div style={container}>
      <ScrollReveal>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Blog</h1>
        <p style={{ color: theme.muted, marginBottom: '2.5rem', fontSize: '1.1rem' }}>Thoughts, projects, and updates.</p>
      </ScrollReveal>
      {(!Array.isArray(data) || data.length === 0) && <p style={{ color: theme.muted }}>No posts yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Array.isArray(data) && data.map((post, i) => (
          <ScrollReveal key={post.id} delay={i * 0.08} direction="up">
            <Link to={`/blog/${post.Slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '1.5rem 2rem',
                boxShadow: theme.shadow,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = theme.shadowHover }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = theme.shadow }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: theme.text, fontWeight: 600 }}>{post.Title}</h2>
                  {post.Category && (
                    <span style={categoryBadge(theme.accent)}>{post.Category}</span>
                  )}
                </div>
                <span style={{ fontSize: '0.8rem', color: theme.muted }}>
                  {post.PublishedDate ? new Date(post.PublishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
