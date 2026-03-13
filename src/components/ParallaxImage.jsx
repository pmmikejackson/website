import { useEffect, useRef, useState } from 'react'

export default function ParallaxImage({
  src,
  alt = '',
  speed = 0.3,
  height = '60vh',
  overlay = 'rgba(0,0,0,0.15)',
  children,
  style = {},
}) {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const el = ref.current
        if (!el) { ticking.current = false; return }
        const rect = el.getBoundingClientRect()
        const viewH = window.innerHeight
        // Only compute when visible
        if (rect.bottom > 0 && rect.top < viewH) {
          const progress = (viewH - rect.top) / (viewH + rect.height)
          setOffset((progress - 0.5) * speed * rect.height)
        }
        ticking.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        height,
        overflow: 'hidden',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '120%',
          objectFit: 'cover',
          transform: `translateY(calc(-50% + ${offset}px))`,
          willChange: 'transform',
        }}
      />
      {overlay && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: overlay,
          pointerEvents: 'none',
        }} />
      )}
      {children && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}
