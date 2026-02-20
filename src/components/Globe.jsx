import { useEffect, useRef, useState, useCallback } from 'react'
import createGlobe from 'cobe'

export default function Globe({ locations, speed = 0.003 }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [size, setSize] = useState(400)
  const [dragging, setDragging] = useState(false)

  // Drag state refs
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const dragStartPhi = useRef(0)
  const dragStartTheta = useRef(0)
  const phiRef = useRef(0)
  const thetaRef = useRef(0.2)
  const pausedRef = useRef(false)
  const resumeTimer = useRef(null)

  // Responsive sizing
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      setSize(Math.min(w, 500))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Pointer handlers
  const handlePointerDown = useCallback((e) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
    isDragging.current = true
    setDragging(true)
    dragStartX.current = clientX
    dragStartY.current = clientY
    dragStartPhi.current = phiRef.current
    dragStartTheta.current = thetaRef.current
    pausedRef.current = true
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return
    const clientX = e.type?.includes('touch') ? e.touches?.[0]?.clientX : e.clientX
    const clientY = e.type?.includes('touch') ? e.touches?.[0]?.clientY : e.clientY
    if (clientX == null || clientY == null) return
    const dx = clientX - dragStartX.current
    const dy = clientY - dragStartY.current
    phiRef.current = dragStartPhi.current - dx * 0.005
    thetaRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2,
      dragStartTheta.current + dy * 0.005
    ))
  }, [])

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    setDragging(false)
    resumeTimer.current = setTimeout(() => { pausedRef.current = false }, 2000)
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

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    }
  }, [])

  // Globe
  useEffect(() => {
    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.2,
      dark: 0,
      diffuse: 1.5,
      mapSamples: 16000,
      mapBrightness: 1.5,
      baseColor: [0.62, 0.72, 0.85],
      markerColor: [0.1, 0.8, 0.4],
      glowColor: [0.85, 0.88, 0.95],
      markers: locations.map(loc => ({
        location: [loc.lat, loc.lng],
        size: 0.06,
      })),
      onRender: (state) => {
        if (!pausedRef.current) {
          phiRef.current += speed
        }
        state.phi = phiRef.current
        state.theta = thetaRef.current
      },
    })

    return () => globe.destroy()
  }, [locations, size, speed])

  return (
    <section
      ref={containerRef}
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        Locations
      </h2>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          maxWidth: '100%',
          aspectRatio: '1',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      />
    </section>
  )
}
