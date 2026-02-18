import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPages, getStrapiMedia } from '../lib/strapi'

export default function Home({ theme }) {
  const [activeModal, setActiveModal] = useState(null)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPages()
      .then(setPages)
      .catch(() => setPages([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* Hero */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Mike Jackson</h1>
        <p style={{ fontSize: '1.3rem', color: theme.muted, marginBottom: '1rem' }}>
          Builder of things. Starter of projects. Occasional finisher.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveModal('github')}
            style={{ background: 'none', border: 'none', color: theme.accent, textDecoration: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
          >GitHub</button>
          <button
            onClick={() => setActiveModal('linkedin')}
            style={{ background: 'none', border: 'none', color: theme.accent, textDecoration: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
          >LinkedIn</button>
          <a href="mailto:mike@themikejackson.com" style={{ color: theme.accent, textDecoration: 'none' }}>Email</a>
        </div>
      </section>

      {/* Pages */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Pages</h2>
        {loading && <p style={{ color: theme.muted }}>Loading...</p>}
        {!loading && pages.length === 0 && <p style={{ color: theme.muted }}>No pages yet.</p>}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 190px)',
          gap: '1rem',
          justifyContent: 'center',
        }}>
          {pages.map((page) => {
            const heroUrl = page.HeroImage?.url ? getStrapiMedia(page.HeroImage.url) : null
            return (
              <Link key={page.id} to={`/pages/${page.Slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  width: '190px',
                }}>
                  {heroUrl && (
                    <img
                      src={heroUrl}
                      alt={page.Title}
                      style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                  <div style={{ padding: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.9rem', margin: 0 }}>{page.Title}</h3>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* External link popup */}
      {activeModal && (() => {
        const modals = {
          github: { label: 'GitHub', url: 'https://github.com' },
          linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/michael-c-jackson01/' },
        }
        const m = modals[activeModal]
        return (
          <div
            onClick={() => setActiveModal(null)}
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
              <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Open {m.label} in a new tab?</p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setActiveModal(null)}
                  style={{
                    background: theme.accent,
                    color: '#fff',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                  }}
                >Open {m.label}</a>
                <button
                  onClick={() => setActiveModal(null)}
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
        )
      })()}
    </>
  )
}
