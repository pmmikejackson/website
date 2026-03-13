import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPosts, getPost, getStrapiMedia } from '../lib/strapi'
import { containerStyle, categoryBadge } from '../lib/styles'
import RichText from '../components/RichText'

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

  if (loading) return <div style={containerStyle}><p style={{ color: theme.muted }}>Loading...</p></div>
  if (error) return <div style={containerStyle}><p style={{ color: '#ef4444' }}>Failed to load: {error}</p></div>

  if (slug) {
    if (!data) return (
      <div style={containerStyle}>
        <p style={{ color: theme.muted }}>Post not found.</p>
        <Link to="/blog" style={{ color: theme.accent }}>Back to Blog</Link>
      </div>
    )

    const imageUrl = data.FeaturedImage?.url ? getStrapiMedia(data.FeaturedImage.url) : null

    return (
      <div style={containerStyle}>
        <Link to="/blog" style={{ color: theme.muted, textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Blog</Link>
        <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '0.5rem' }}>{data.Title}</h1>
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
        {imageUrl && <img src={imageUrl} alt={data.Title} style={{ width: '100%', borderRadius: '8px', marginBottom: '2rem', maxHeight: '400px', objectFit: 'cover' }} />}
        <RichText blocks={data.Body} theme={theme} />
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Blog</h1>
      {(!Array.isArray(data) || data.length === 0) && <p style={{ color: theme.muted }}>No posts yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Array.isArray(data) && data.map((post) => (
          <Link key={post.id} to={`/blog/${post.Slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '1.5rem',
              transition: 'border-color 0.2s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: theme.text }}>{post.Title}</h2>
                {post.Category && (
                  <span style={categoryBadge(theme.accent)}>{post.Category}</span>
                )}
              </div>
              <span style={{ fontSize: '0.8rem', color: theme.muted }}>
                {post.PublishedDate ? new Date(post.PublishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
