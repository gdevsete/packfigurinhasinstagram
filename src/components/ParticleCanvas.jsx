import { useEffect, useRef } from 'react'

const COLORS = ['#39ff14', '#ff2d78', '#ffd700', '#00d4ff', '#bc13fe']

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
const PARTICLE_COUNT = isMobile ? 25 : 55

function createParticle(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    size: Math.random() * 2 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.35 + 0.05,
    alphaDir: (Math.random() - 0.5) * 0.004,
  }
}

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    let animId
    let particles = []
    let frame = 0

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function init() {
      resize()
      particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(canvas))
    }

    function draw() {
      animId = requestAnimationFrame(draw)

      // Throttle: desktop 30fps, mobile 20fps
      frame++
      if (frame % (isMobile ? 3 : 2) !== 0) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha += p.alphaDir
        if (p.alpha <= 0.02 || p.alpha >= 0.40) p.alphaDir *= -1
        if (p.x < -5) p.x = canvas.width + 5
        if (p.x > canvas.width + 5) p.x = -5
        if (p.y < -5) p.y = canvas.height + 5
        if (p.y > canvas.height + 5) p.y = -5

        // Simple filled circle — no gradient, no shadow
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    init()
    draw()

    window.addEventListener('resize', resize, { passive: true })
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="particle-canvas" aria-hidden="true" />
}
