import { useEffect, useRef } from 'react'

const COLORS = ['#39ff14', '#ff2d78', '#ffd700', '#00d4ff', '#bc13fe', '#ff6b35']

function createParticle(canvas) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const type = Math.random() > 0.5 ? 'dot' : 'star'
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2.5 + 0.5,
    color,
    alpha: Math.random() * 0.4 + 0.05,
    alphaDir: (Math.random() - 0.5) * 0.005,
    type,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
  }
}

function drawStar(ctx, x, y, size, rotation) {
  const spikes = 4
  const outerR = size * 2
  const innerR = size * 0.8
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.beginPath()
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = (i * Math.PI) / spikes
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
  }
  ctx.closePath()
  ctx.restore()
}

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []
    const PARTICLE_COUNT = 120

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function init() {
      resize()
      particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(canvas))
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        // Update
        p.x += p.vx
        p.y += p.vy
        p.alpha += p.alphaDir
        p.rotation += p.rotSpeed

        // Bounce alpha
        if (p.alpha <= 0.02 || p.alpha >= 0.45) p.alphaDir *= -1

        // Wrap around
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        // Draw
        ctx.save()
        ctx.globalAlpha = p.alpha

        if (p.type === 'dot') {
          // Spray dot with glow
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
          gradient.addColorStop(0, p.color)
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fill()

          // Core dot
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Sparkle star
          drawStar(ctx, p.x, p.y, p.size, p.rotation)
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 6
          ctx.fill()
        }

        ctx.restore()
      })

      animId = requestAnimationFrame(draw)
    }

    init()
    draw()

    const onResize = () => {
      resize()
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} id="particle-canvas" aria-hidden="true" />
}
