import { memo } from 'react'

// Desktop: nas laterais (não atrapalha conteúdo central)
const FLOATERS_DESKTOP = [
  { src: '/stickers/animados/deita-aqui.gif',                   size: 92,  top: '6%',   left: '1%',    anim: 'float-drift',  delay: '0s',   opacity: 0.24 },
  { src: '/stickers/animados/bom-e-novo.gif',                   size: 82,  top: '20%',  right: '0.5%', anim: 'float-spin',   delay: '1.4s', opacity: 0.22 },
  { src: '/stickers/figurinhas/hahaha.png',                     size: 76,  top: '38%',  left: '0.5%',  anim: 'float-bounce', delay: '0.7s', opacity: 0.20 },
  { src: '/stickers/animados/marcha-nas-entrega.gif',           size: 96,  top: '58%',  right: '0%',   anim: 'float-drift',  delay: '2.1s', opacity: 0.24 },
  { src: '/stickers/figurinhas/muitolouco.png',                 size: 72,  top: '76%',  left: '0.5%',  anim: 'float-spin',   delay: '3.2s', opacity: 0.18 },
  { src: '/stickers/animados/espancando-o-ifood.gif',           size: 86,  top: '30%',  right: '0.5%', anim: 'float-bounce', delay: '0.9s', opacity: 0.22 },
  { src: '/stickers/figurinhas/domingrau.png',                  size: 78,  top: '50%',  left: '0%',    anim: 'float-drift',  delay: '4.1s', opacity: 0.18 },
  { src: '/stickers/animados/hoje-e-300.gif',                   size: 88,  top: '88%',  right: '0.5%', anim: 'float-bounce', delay: '1.8s', opacity: 0.20 },
  { src: '/stickers/animados/boa-tarde-pra-geral.gif',          size: 80,  top: '14%',  left: '0.5%',  anim: 'float-spin',   delay: '5s',   opacity: 0.20 },
  { src: '/stickers/figurinhas/credoze.png',                    size: 74,  top: '68%',  right: '0%',   anim: 'float-bounce', delay: '2.6s', opacity: 0.18 },
  { src: '/stickers/animados/a-meta-e-faturar.gif',             size: 90,  top: '44%',  right: '0.5%', anim: 'float-drift',  delay: '3.5s', opacity: 0.22 },
  { src: '/stickers/figurinhas/reagemuitoessestory.png',        size: 76,  top: '94%',  left: '0.5%',  anim: 'float-spin',   delay: '1.1s', opacity: 0.16 },
]

// Mobile: espalhados estrategicamente (menores, sem atrapalhar UI)
const FLOATERS_MOBILE = [
  { src: '/stickers/animados/deita-aqui.gif',          size: 58,  top: '5%',   left: '0%',    anim: 'float-drift',  delay: '0s',   opacity: 0.28 },
  { src: '/stickers/animados/bom-e-novo.gif',          size: 54,  top: '5%',   right: '0%',   anim: 'float-spin',   delay: '1.2s', opacity: 0.26 },
  { src: '/stickers/figurinhas/hahaha.png',            size: 52,  top: '22%',  left: '0%',    anim: 'float-bounce', delay: '0.6s', opacity: 0.22 },
  { src: '/stickers/animados/espancando-o-ifood.gif',  size: 56,  top: '22%',  right: '0%',   anim: 'float-drift',  delay: '2s',   opacity: 0.24 },
  { src: '/stickers/animados/marcha-nas-entrega.gif',  size: 60,  top: '40%',  left: '0%',    anim: 'float-spin',   delay: '1.8s', opacity: 0.26 },
  { src: '/stickers/animados/hoje-e-300.gif',          size: 56,  top: '40%',  right: '0%',   anim: 'float-bounce', delay: '0.4s', opacity: 0.24 },
  { src: '/stickers/figurinhas/muitolouco.png',        size: 50,  top: '60%',  left: '0%',    anim: 'float-drift',  delay: '3s',   opacity: 0.20 },
  { src: '/stickers/animados/a-meta-e-faturar.gif',    size: 56,  top: '60%',  right: '0%',   anim: 'float-spin',   delay: '2.4s', opacity: 0.22 },
  { src: '/stickers/figurinhas/domingrau.png',         size: 52,  top: '78%',  left: '0%',    anim: 'float-bounce', delay: '1.5s', opacity: 0.20 },
  { src: '/stickers/animados/boa-tarde-pra-geral.gif', size: 58,  top: '78%',  right: '0%',   anim: 'float-drift',  delay: '4s',   opacity: 0.22 },
]

const FloatingDecorations = memo(function FloatingDecorations() {
  const isMobile = window.innerWidth <= 768

  const list = isMobile ? FLOATERS_MOBILE : FLOATERS_DESKTOP

  return (
    <div className="floating-decorations" aria-hidden="true">
      {list.map((f, i) => (
        <img
          key={i}
          src={f.src}
          alt=""
          draggable={false}
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
