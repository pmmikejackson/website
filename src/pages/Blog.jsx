import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPosts, getPost } from '../lib/strapi'

export default function Blog({ theme }) {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const fetch = slug ? getPost(slug) : getPosts()
    fetch
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  const containerStyle = { maxWidth: '900px', margin: '0 auto', padding: '2rem' }
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

  // Single post view
  if (slug) {
    if (!data) return (
      <div style={containerStyle}>
        <p style={mutedStyle}>Post not found.</p>
        <Link to="/blog" style={{ color: theme.accent }}>Back to Blog</Link>
      </div>
    )

    const { title, content, publishedAt } = data
    return (
      <div style={containerStyle}>
        <Link to="/blog" style={{ color: theme.muted, textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Blog
        </Link>
        <h1 style={{ fontSize: '2rem', margin: '1.5rem 0 0.5rem' }}>{title}</h1>
        <p style={{ ...mutedStyle, marginBottom: '2rem' }}>
          {publishedAt ? new Date(publishedAt).toLocaleDateString() : ''}
        </p>
        <div style={{ lineHeight: 1.7, color: theme.text }}
          dangerouslySetInnerHTML={{ __html: content ?? '' }}
        />
      </div>
    )
  }

  // Post list view
  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Blog</h1>
      {data.length === 0 && <p style={mutedStyle}>No posts yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.map((post) => {
          const { title, slug: postSlug, description, publishedAt } = post
          return (
            <Link
              key={post.id}
              to={`/blog/${postSlug}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                padding: '1.5rem',
                transition: 'border-color 0.2s ease',
              }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: theme.text }}>{title}</h2>
                {description && <p style={{ color: theme.muted, marginBottom: '0.5rem' }}>{description}</p>}
                <span style={{ fontSize: '0.8rem', color: theme.muted }}>
                  {publishedAt ? new Date(publishedAt).toLocaleDateString() : ''}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
