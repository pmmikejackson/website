import { useState, useEffect, useRef, useCallback } from 'react'
import { getCarouselItems, getHomepageSettings, getLocations } from '../lib/strapi'
import Carousel3D from '../components/Carousel3D'
import Globe from '../components/Globe'
import ScrollReveal from '../components/ScrollReveal'
import ParallaxImage from '../components/ParallaxImage'

const UNSPLASH = {
  hero: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
  code: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  workspace: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  abstract: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80',
  nature: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
  city: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
  mountains: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
}

export default function Home({ theme, darkMode }) {
  const [activeModal, setActiveModal] = useState(null)
  const [carouselItems, setCarouselItems] = useState([])
  const [carouselSpeed, setCarouselSpeed] = useState(undefined)
  const [globeSpeed, setGlobeSpeed] = useState(undefined)
  const [allLocations, setAllLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

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

  // Subtle mouse tracking for hero floating elements
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <>
      {/* === HERO === */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: theme.heroBg,
      }}>
        {/* Animated gradient background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: darkMode
            ? 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.1) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236,72,153,0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        {/* Floating images that respond to mouse */}
        <FloatingImage
          src={UNSPLASH.code}
          alt="Code on screen"
          size={220}
          top="12%"
          left="5%"
          rotation={-8}
          mousePos={mousePos}
          parallaxFactor={15}
          delay={0.2}
          theme={theme}
        />
        <FloatingImage
          src={UNSPLASH.workspace}
          alt="Workspace"
          size={180}
          top="60%"
          right="6%"
          rotation={6}
          mousePos={mousePos}
          parallaxFactor={-20}
          delay={0.5}
          theme={theme}
        />
        <FloatingImage
          src={UNSPLASH.city}
          alt="City lights"
          size={150}
          bottom="15%"
          left="10%"
          rotation={4}
          mousePos={mousePos}
          parallaxFactor={10}
          delay={0.8}
          theme={theme}
        />

        {/* Hero content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '700px',
          padding: '2rem',
        }}>
          <ScrollReveal direction="up" duration={0.9}>
            <p style={{
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: theme.accent,
              marginBottom: '1.5rem',
              fontWeight: 600,
            }}>Welcome</p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.15} duration={0.9}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}>
              Mike Jackson
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3} duration={0.9}>
            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: theme.muted,
              marginBottom: '2.5rem',
              lineHeight: 1.6,
            }}>
              Builder of things. Starter of projects.<br />Occasional finisher.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.45} duration={0.9}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveModal('github')}
                style={{
                  background: theme.gradient,
                  color: '#fff',
                  border: 'none',
                  padding: '0.85rem 2rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)' }}
                onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 15px rgba(99,102,241,0.3)' }}
              >GitHub</button>
              <button
                onClick={() => setActiveModal('linkedin')}
                style={{
                  background: 'transparent',
                  color: theme.accent,
                  border: `2px solid ${theme.accent}`,
                  padding: '0.85rem 2rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={e => { e.target.style.background = theme.accent; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = theme.accent }}
              >LinkedIn</button>
              <a href="mailto:mike@themikejackson.com" style={{
                color: theme.muted,
                textDecoration: 'none',
                padding: '0.85rem 2rem',
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                Email
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: theme.muted,
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          animation: 'fadeInBounce 2s ease infinite',
        }}>
          <span>Scroll</span>
          <div style={{
            width: '1px',
            height: '30px',
            background: `linear-gradient(to bottom, ${theme.muted}, transparent)`,
          }} />
        </div>
      </section>

      {/* === PARALLAX BREAK: Abstract === */}
      <ParallaxImage
        src={UNSPLASH.abstract}
        alt="Abstract art"
        height="50vh"
        speed={0.4}
        overlay={darkMode ? 'rgba(17,17,20,0.5)' : 'rgba(255,255,255,0.3)'}
      >
        <ScrollReveal>
          <p style={{
            fontSize: 'clamp(1.3rem, 3vw, 2rem)',
            fontWeight: 700,
            color: '#fff',
            textAlign: 'center',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            maxWidth: '600px',
          }}>
            Creating digital experiences that matter.
          </p>
        </ScrollReveal>
      </ParallaxImage>

      {/* === CAROUSEL === */}
      {!loading && carouselItems.length >= 3 && (
        <ScrollReveal style={{ paddingTop: '4rem' }}>
          <Carousel3D items={carouselItems} theme={theme} speed={carouselSpeed} />
        </ScrollReveal>
      )}

      {/* === PARALLAX BREAK: Nature === */}
      <ParallaxImage
        src={UNSPLASH.nature}
        alt="Valley with fog"
        height="45vh"
        speed={0.3}
        overlay={darkMode ? 'rgba(17,17,20,0.4)' : 'rgba(0,0,0,0.15)'}
      />

      {/* === GLOBE === */}
      {!loading && allLocations.length > 0 && (
        <ScrollReveal style={{ paddingBottom: '2rem' }}>
          <Globe locations={allLocations} speed={globeSpeed} />
        </ScrollReveal>
      )}

      {/* === PARALLAX BREAK: Mountains === */}
      <ParallaxImage
        src={UNSPLASH.mountains}
        alt="Mountain landscape"
        height="50vh"
        speed={0.5}
        overlay={darkMode ? 'rgba(17,17,20,0.45)' : 'rgba(0,0,0,0.2)'}
      >
        <ScrollReveal>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            color: '#fff',
            textAlign: 'center',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            maxWidth: '500px',
            lineHeight: 1.6,
            fontWeight: 500,
          }}>
            Always building. Always exploring.
          </p>
        </ScrollReveal>
      </ParallaxImage>

      {/* External link popup */}
      <ExternalLinkModal activeModal={activeModal} setActiveModal={setActiveModal} theme={theme} />
    </>
  )
}

function FloatingImage({ src, alt, size, mousePos, parallaxFactor, delay, rotation = 0, theme, ...pos }) {
  return (
    <div style={{
      position: 'absolute',
      ...pos,
      width: `${size}px`,
      height: `${size * 0.75}px`,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: theme.shadow,
      transform: `rotate(${rotation}deg) translate(${mousePos.x * parallaxFactor}px, ${mousePos.y * parallaxFactor * 0.5}px)`,
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: 0,
      animation: `floatIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s forwards`,
      zIndex: 1,
    }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  )
}

const EXTERNAL_LINKS = {
  github: { label: 'GitHub', url: 'https://github.com/pmmikejackson' },
  linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/michael-c-jackson01/' },
}

function ExternalLinkModal({ activeModal, setActiveModal, theme }) {
  const dialogRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (activeModal) {
      previousFocus.current = document.activeElement
      dialog.showModal()
    } else {
      dialog.close()
      previousFocus.current?.focus()
    }
  }, [activeModal])

  const handleClose = useCallback(() => setActiveModal(null), [setActiveModal])

  if (!activeModal) return null
  const m = EXTERNAL_LINKS[activeModal]
  if (!m) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '16px',
        padding: '2.5rem',
        maxWidth: '360px',
        width: '90%',
        textAlign: 'center',
        color: theme.text,
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
      }}
    >
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.5 }}>Open {m.label} in a new tab?</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <a
          href={m.url}
          target="_blank"
          rel="noreferrer"
          onClick={handleClose}
          style={{
            background: theme.gradient,
            color: '#fff',
            padding: '0.7rem 1.5rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >Open {m.label}</a>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: `1px solid ${theme.border}`,
            color: theme.text,
            padding: '0.7rem 1.5rem',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >Cancel</button>
      </div>
    </dialog>
  )
}
