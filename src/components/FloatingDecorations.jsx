import { memo } from 'react'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

// Desktop: max 6 itens, mistura PNG + GIF (GIFs com delay longo pra não sobrecarregar)
const FLOATERS_DESKTOP = [
  { src: '/stickers/figurinhas/hahaha.png',            size: 82,  top: '7%',   left: '1%',    anim: 'float-drift',  delay: '0s',   opacity: 0.22 },
  { src: '/stickers/animados/bom-e-novo.gif',          size: 78,  top: '22%',  right: '0.5%', anim: 'float-spin',   delay: '2s',   opacity: 0.20 },
  { src: '/stickers/figurinhas/muitolouco.png',        size: 74,  top: '42%',  left: '0.5%',  anim: 'float-bounce', delay: '1s',   opacity: 0.18 },
  { src: '/stickers/animados/marcha-nas-entrega.gif',  size: 86,  top: '60%',  right: '0%',   anim: 'float-drift',  delay: '3s',   opacity: 0.20 },
  { src: '/stickers/figurinhas/domingrau.png',         size: 76,  top: '78%',  left: '0%',    anim: 'float-spin',   delay: '1.5s', opacity: 0.18 },
  { src: '/stickers/figurinhas/credoze.png',           size: 72,  top: '88%',  right: '0.5%', anim: 'float-bounce', delay: '4s',   opacity: 0.16 },
]

// Mobile: apenas PNGs estáticos (GIFs consomem CPU demais)
const FLOATERS_MOBILE = [
  { src: '/stickers/figurinhas/hahaha.png',     size: 52, top: '5%',   left: '0%',  anim: 'float-drift',  delay: '0s',   opacity: 0.25 },
  { src: '/stickers/figurinhas/muitolouco.png', size: 48, top: '5%',   right: '0%', anim: 'float-spin',   delay: '1.5s', opacity: 0.22 },
  { src: '/stickers/figurinhas/domingrau.png',  size: 50, top: '35%',  left: '0%',  anim: 'float-bounce', delay: '0.8s', opacity: 0.20 },
  { src: '/stickers/figurinhas/credoze.png',    size: 48, top: '35%',  right: '0%', anim: 'float-drift',  delay: '2s',   opacity: 0.20 },
  { src: '/stickers/figurinhas/eosguri.png',    size: 50, top: '68%',  left: '0%',  anim: 'float-spin',   delay: '1s',   opacity: 0.18 },
  { src: '/stickers/figurinhas/original.png',   size: 48, top: '68%',  right: '0%', anim: 'float-bounce', delay: '3s',   opacity: 0.18 },
]

const FloatingDecorations = memo(function FloatingDecorations() {
  const list = isMobile ? FLOATERS_MOBILE : FLOATERS_DESKTOP

  return (
    <div className="floating-decorations" aria-hidden="true">
      {list.map((f, i) => (
        <img
          key={i}
          src={f.src}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          className={`floater floater-${f.anim}`}
          style={{
            width: f.size,
            height: f.size,
            top: f.top,
            left: f.left,
            right: f.right,
            opacity: f.opacity,
            animationDelay: f.delay,
          }}
        />
      ))}
    </div>
  )
})

export default FloatingDecorations
