import { useState, useEffect } from 'react'
import { getCarouselItems, getHomepageSettings, getLocations } from '../lib/strapi'
import Carousel3D from '../components/Carousel3D'
import Globe from '../components/Globe'

export default function Home({ theme }) {
  const [activeModal, setActiveModal] = useState(null)
  const [carouselItems, setCarouselItems] = useState([])
  const [carouselSpeed, setCarouselSpeed] = useState(undefined)
  const [globeSpeed, setGlobeSpeed] = useState(undefined)
  const [allLocations, setAllLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getCarouselItems().catch(() => []),
      getHomepageSettings().catch(() => ({})),
      getLocations().catch(() => []),
    ]).then(([items, settings, locations]) => {
      setCarouselItems(items)
      if (settings.CarouselSpeed) setCarouselSpeed(settings.CarouselSpeed)
      if (settings.GlobeSpeed) setGlobeSpeed(settings.GlobeSpeed)

      const locs = [
        ...locations.map(l => ({ lat: l.Latitude, lng: l.Longitude, name: l.Name })),
        ...items.filter(i => i.Latitude && i.Longitude)
          .map(i => ({ lat: i.Latitude, lng: i.Longitude, name: i.Title })),
      ]
      setAllLocations(locs)
    }).finally(() => setLoading(false))
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

      {/* Carousel */}
      {!loading && carouselItems.length >= 3 && (
        <Carousel3D items={carouselItems} theme={theme} speed={carouselSpeed} />
      )}

      {/* Globe */}
      {!loading && allLocations.length > 0 && (
        <Globe locations={allLocations} speed={globeSpeed} />
      )}

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
