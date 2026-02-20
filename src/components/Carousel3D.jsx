import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getStrapiMedia } from '../lib/strapi'

export default function Carousel3D({ items, theme, speed = 0.02 }) {
  const [rotation, setRotation] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [containerWidth, setContainerWidth] = useState(900)
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartRotation = useRef(0)
  const didDrag = useRef(false)
  const animationRef = useRef(null)
  const resumeTimerRef = useRef(null)
  const rotationRef = useRef(0)

  const N = items.length
  const cardWidth = Math.min(200, containerWidth * 0.28)
  const cardHeight = cardWidth * 1.25
  const angleStep = N > 0 ? 360 / N : 0
  const radius = Math.max(250, containerWidth * 0.35)

  // Keep ref in sync with state for use in event handlers
  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  // Responsive container width
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Auto-rotation
  useEffect(() => {
    if (isPaused || prefersReducedMotion || N === 0) return

    let lastTime = performance.now()
    const animate = (now) => {
      const delta = now - lastTime
      lastTime = now
      setRotation(prev => prev + delta * speed)
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPaused, prefersReducedMotion, N, speed])

  // Pointer handlers
  const handlePointerDown = useCallback((e) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
    isDragging.current = true
    setDragging(true)
    didDrag.current = false
    dragStartX.current = clientX
    dragStartRotation.current = rotationRef.current
    setIsPaused(true)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return
    const clientX = e.type?.includes('touch') ? e.touches?.[0]?.clientX : e.clientX
    if (clientX == null) return
    const diff = clientX - dragStartX.current
    if (Math.abs(diff) > 5) didDrag.current = true
    setRotation(dragStartRotation.current + diff * 0.3)
  }, [])

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    setDragging(false)
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), 2000)
  }, [])

  // Window-level move/up listeners
  useEffect(() => {
    const onMove = (e) => handlePointerMove(e)
    const onUp = () => handlePointerUp()

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [handlePointerMove, handlePointerUp])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [])

  const handleLinkClick = (e) => {
    if (didDrag.current) e.preventDefault()
  }

  if (N < 3) return null

  // Map a value from [inMin, inMax] to [outMin, outMax]
  const mapRange = (value, inMin, inMax, outMin, outMax) => {
    const clamped = Math.max(inMin, Math.min(inMax, value))
    return outMin + ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin)
  }

  const sceneStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 2rem 0',
    overflow: 'hidden',
    cursor: dragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'pan-y',
  }

  const trackStyle = {
    position: 'relative',
    width: '100%',
    height: `${cardHeight * 1.15}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <section
      ref={containerRef}
      style={sceneStyle}
      aria-label="Featured events carousel"
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        Featured
      </h2>
      <div style={trackStyle}>
        {items.map((item, i) => {
          const angleDeg = (i * angleStep) + rotation
          const angleRad = (angleDeg * Math.PI) / 180
          const x = Math.sin(angleRad) * radius
          const z = Math.cos(angleRad) * radius

          const scale = mapRange(z, -radius, radius, 0.55, 1.0)
          const opacity = mapRange(z, -radius, radius, 0.35, 1.0)
          const zIndex = Math.round(z + radius)
          const isFront = z > radius * 0.85

          const heroUrl = item.PosterImage?.url ? getStrapiMedia(item.PosterImage.url) : null
          const pageSlug = item.page?.Slug

          const card = (
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              transform: `translate(-50%, -50%) translateX(${x}px) scale(${scale})`,
              zIndex,
              opacity,
              pointerEvents: isFront ? 'auto' : 'none',
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: `0 ${4 * scale}px ${12 * scale}px rgba(0,0,0,${0.15 + (1 - scale) * 0.2})`,
              display: 'flex',
              flexDirection: 'column',
              willChange: 'transform, opacity',
            }}>
              {heroUrl && (
                <img
                  src={heroUrl}
                  alt={item.Title}
                  draggable={false}
                  style={{
                    width: '100%',
                    flex: 1,
                    objectFit: 'cover',
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                />
              )}
              <div style={{
                padding: '0.6rem 0.75rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: theme.text,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {item.Title}
              </div>
            </div>
          )

          if (pageSlug && isFront) {
            return (
              <Link
                key={item.id}
                to={`/pages/${pageSlug}`}
                onClick={handleLinkClick}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {card}
              </Link>
            )
          }

          return <div key={item.id}>{card}</div>
        })}
      </div>
    </section>
  )
}
