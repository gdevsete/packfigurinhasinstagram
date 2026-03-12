import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'

/* ─── canvas: 9:16 story ratio ───────────────────────────── */
const CANVAS_W = 225
const CANVAS_H = 400
const EXPORT_W = 1080
const EXPORT_H = 1920
const RATIO = EXPORT_W / CANVAS_W   // 4.8

/* ─── emoji categories ───────────────────────────────────── */
const EMOJI_CATS = [
  { id: 'caras',    label: '😀', name: 'Caras', emojis: [
    '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😉','😊','😇','🥰','😍','🤩','😘',
    '☺️','😋','😛','😜','🤪','😝','🤑','🤗','🤔','😐','😑','😏','😒','🙄','😬','😌',
    '😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','😵','🤯','🥳','😎',
    '🤓','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😢','😭','😱','😖','😣','😩',
    '😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','👻','🤡','💩','👹','👺','👾','🤖','👽',
  ]},
  { id: 'gestos',   label: '👋', name: 'Gestos', emojis: [
    '👋','🤚','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️',
    '👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦵','🦶',
    '👂','🦻','👃','👀','👁','👅','👄','💋','🫀','🫁','🧠','🦷','🦴',
  ]},
  { id: 'pessoas',  label: '🧑', name: 'Pessoas', emojis: [
    '👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵',
    '🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','💃','🕺',
    '🧙','🧝','🦸','🦹','🥷','👑','👸','🤴','🎅','🤶','👼',
    '🕵️','👮','👷','💂','🧑‍⚕️','🧑‍🍳','🧑‍🎤','🧑‍🎨','🧑‍✈️','🧑‍🚀',
  ]},
  { id: 'animais',  label: '🐶', name: 'Animais', emojis: [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵',
    '🙈','🙉','🙊','🐔','🐧','🐦','🦆','🦅','🦉','🦇','🐺','🐴','🦄','🐝','🦋',
    '🐛','🐞','🐜','🕷','🐢','🐍','🦎','🐙','🦑','🐡','🐠','🐟','🐬','🐳','🐋',
    '🦈','🐊','🐅','🐆','🦓','🐘','🦒','🦘','🐕','🐩','🐈','🦚','🦜','🕊','🐇','🦔',
    '🐁','🐀','🐿','🦝','🦦','🦥','🌿','🌸','🌺','🌻','🌹','🍀','🌱','🌲','🌳','🪴',
  ]},
  { id: 'comida',   label: '🍕', name: 'Comida', emojis: [
    '🍎','🍊','🍋','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🌽','🌶','🥦',
    '🧄','🧅','🥔','🍠','🧀','🥚','🍳','🥞','🧇','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕',
    '🌮','🌯','🥙','🍱','🍣','🍤','🍜','🍝','🍛','🍰','🎂','🧁','🍩','🍪','🍫','🍬','🍭',
    '🍿','🧃','🥤','🧋','☕','🍵','🧊','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🍾','🥧',
  ]},
  { id: 'esportes', label: '⚽', name: 'Esportes', emojis: [
    '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🎱','🏓','🏸','🏒','⛳','🎯','🏹','🥊','🥋',
    '🤸','⛹️','🏋️','🏊','🏄','🏇','🧗','⛷️','🏂','🛷','🤺','🏆','🥇','🥈','🥉','🏅',
    '🎖️','🎽','🎣','🤿','🧩','🎮','🕹️','🎲','🎰','🎳','🎯','🪀','🪁','🎿','🛹','🛼',
  ]},
  { id: 'lugares',  label: '✈️', name: 'Lugares', emojis: [
    '✈️','🚀','🛸','🚁','🚗','🚕','🚙','🏎️','🚓','🚑','🚒','🛵','🏍️','🚲','🛴','🛹',
    '⛵','🚢','🛳️','🛶','🌍','🌎','🌏','🗺️','🏔️','⛰️','🌋','🏕️','🏖️','🏜️','🏝️','🏛️',
    '🏟️','🌃','🌄','🌅','🌆','🌇','🌉','🌌','🎆','🎇','🏠','🏡','🏢','🏰','🏯','🗼','🗽',
    '⛪','🕌','⛩️','🎡','🎢','🎠','⛽','🚦',
  ]},
  { id: 'objetos',  label: '💡', name: 'Objetos', emojis: [
    '💡','🔦','🕯️','💎','💍','💰','💵','💸','🎁','🎀','🎊','🎉','🎈','🎏','🎐','🎑',
    '📱','💻','🖥️','⌨️','📷','📸','🎥','📺','📻','🎙️','🎧','📡','🔭','🔬',
    '💊','🩺','🩹','🔑','🗝️','🔒','🔓','⚙️','🔧','🔨','🧰','🧲','🪄','🔮',
    '📚','📖','📝','✏️','🖊️','📌','📎','✂️','🎭','🎨','🖼️','🪩','🎁','🧸','🪆','🎪',
  ]},
  { id: 'simbolos', label: '✨', name: 'Símbolos', emojis: [
    '⭐','🌟','✨','💫','⚡','🔥','💥','🌈','☀️','🌤️','⛅','🌧️','❄️','🌊','🌀','🌪️',
    '💯','✅','❌','⭕','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🔶','🔷','🔸','🔹',
    '❤️','💕','💞','💓','💗','💖','💘','💝','💟','❣️','🔔','💬','💭','🗨️','♻️',
    '✔️','➕','➖','✖️','💠','🔺','🔻','▶️','⏩','⏭️','⏸️','⏹️','🎵','🎶','🎼',
    '🎤','🎸','🎹','🎺','🎻','🥁','🎷','🏳️','🏴','🚩','🏁','🚀','💣','🧨','🎆','🎇',
  ]},
]

/* ─── background presets ─────────────────────────────────── */
const BG_PRESETS = [
  { id: 'transparent', label: 'Transparente', draw: (ctx, w, h) => {
    const t = 12
    for (let r = 0; r <= h / t; r++) for (let c = 0; c <= w / t; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#1a1a1a' : '#111'
      ctx.fillRect(c * t, r * t, t, t)
    }
  }},
  { id: 'black',    label: 'Preto', draw: (ctx, w, h) => { ctx.fillStyle = '#000'; ctx.fillRect(0,0,w,h) } },
  { id: 'dark',     label: 'Dark', draw: (ctx, w, h) => {
    const g = ctx.createLinearGradient(0,0,w,h)
    g.addColorStop(0,'#0a0a0a'); g.addColorStop(1,'#1a1a2e')
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
  }},
  { id: 'neon-green', label: 'Neon Verde', draw: (ctx, w, h) => {
    const g = ctx.createLinearGradient(0,0,w,h)
    g.addColorStop(0,'#001a00'); g.addColorStop(1,'#003300')
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
    const r = ctx.createRadialGradient(w*.5,h*.3,0,w*.5,h*.3,w*.8)
    r.addColorStop(0,'rgba(57,255,20,0.12)'); r.addColorStop(1,'transparent')
    ctx.fillStyle=r; ctx.fillRect(0,0,w,h)
  }},
  { id: 'neon-pink', label: 'Neon Rosa', draw: (ctx, w, h) => {
    const g = ctx.createLinearGradient(0,0,w,h)
    g.addColorStop(0,'#1a0010'); g.addColorStop(1,'#2d0020')
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
    const r = ctx.createRadialGradient(w*.5,h*.4,0,w*.5,h*.4,w*.8)
    r.addColorStop(0,'rgba(255,45,120,0.14)'); r.addColorStop(1,'transparent')
    ctx.fillStyle=r; ctx.fillRect(0,0,w,h)
  }},
  { id: 'neon-purple', label: 'Purple', draw: (ctx, w, h) => {
    const g = ctx.createLinearGradient(0,0,w,h)
    g.addColorStop(0,'#0d0020'); g.addColorStop(1,'#1a0040')
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
    const r = ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,w*.9)
    r.addColorStop(0,'rgba(188,19,254,0.15)'); r.addColorStop(1,'transparent')
    ctx.fillStyle=r; ctx.fillRect(0,0,w,h)
  }},
  { id: 'gold', label: 'Gold', draw: (ctx, w, h) => {
    const g = ctx.createLinearGradient(0,0,w,h)
    g.addColorStop(0,'#1a1200'); g.addColorStop(1,'#2a1f00')
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
    const r = ctx.createRadialGradient(w*.5,h*.4,0,w*.5,h*.4,w*.8)
    r.addColorStop(0,'rgba(255,215,0,0.12)'); r.addColorStop(1,'transparent')
    ctx.fillStyle=r; ctx.fillRect(0,0,w,h)
  }},
  { id: 'graffiti', label: 'Graffiti', draw: (ctx, w, h) => {
    ctx.fillStyle='#080808'; ctx.fillRect(0,0,w,h)
    const cols = ['rgba(57,255,20,0.08)','rgba(255,45,120,0.07)','rgba(188,19,254,0.06)','rgba(255,215,0,0.06)']
    cols.forEach((c, i) => {
      const r = ctx.createRadialGradient(w*(0.2+i*.2), h*(0.15+i*.2), 0, w*(0.2+i*.2), h*(0.15+i*.2), w*.5)
      r.addColorStop(0,c); r.addColorStop(1,'transparent')
      ctx.fillStyle=r; ctx.fillRect(0,0,w,h)
    })
  }},
  { id: 'sunset', label: 'Sunset', draw: (ctx, w, h) => {
    const g = ctx.createLinearGradient(0,0,0,h)
    g.addColorStop(0,'#0d0221'); g.addColorStop(.5,'#6a0572'); g.addColorStop(1,'#ff6b35')
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
  }},
  { id: 'ocean', label: 'Ocean', draw: (ctx, w, h) => {
    const g = ctx.createLinearGradient(0,0,0,h)
    g.addColorStop(0,'#000428'); g.addColorStop(1,'#004e92')
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
  }},
  { id: 'matrix', label: 'Matrix', draw: (ctx, w, h) => {
    ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h)
    ctx.fillStyle='rgba(0,255,65,0.06)';
    for(let i=0;i<w;i+=8) { ctx.fillRect(i,0,1,h) }
    for(let i=0;i<h;i+=8) { ctx.fillRect(0,i,w,1) }
  }},
  { id: 'white', label: 'Branco', draw: (ctx, w, h) => { ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h) } },
]

/* ─── base fonts (Google Fonts) ──────────────────────────── */
const BASE_FONTS = [
  { label: 'Graffiti', value: '"Permanent Marker", cursive' },
  { label: 'Tech',     value: '"Orbitron", sans-serif' },
  { label: 'Bold',     value: '"Bebas Neue", sans-serif' },
  { label: 'Rajdhani', value: '"Rajdhani", sans-serif' },
  { label: 'Sans',     value: 'Arial Black, sans-serif' },
]

/* ─── fontes locais (public/fonts/) ─────────────────────── */
const LOCAL_FONTS = [
  { label: 'Aerosoldier',           file: 'Aerosoldier_PERSONAL_USE_ONLY.otf' },
  { label: 'Aero Basic',            file: 'AerosoldierBasic_PERSONAL_USE_ONLY.otf' },
  { label: 'Aero Drip',             file: 'AerosoldierDrip_PERSONAL_USE_ONLY.otf' },
  { label: 'Aero Spray',            file: 'AerosoldierSpray_PERSONAL_USE_ONLY.otf' },
  { label: 'Another Tag',           file: 'aAnotherTag.ttf' },
  { label: 'Break Rebel',           file: 'BreakRebel-Regular.ttf' },
  { label: 'Docallisme',            file: 'DOCALLISME ON STREET.ttf' },
  { label: 'DropShade',             file: 'DropShade-Regular.ttf' },
  { label: 'DropShade Extrude',     file: 'DropShade-Extrude.ttf' },
  { label: 'DropShade Melt',        file: 'DropShade-Melt.ttf' },
  { label: 'DropShade Outline',     file: 'DropShade-Outline.ttf' },
  { label: 'DropShade Shadow',      file: 'DropShade-Shadow.ttf' },
  { label: 'Graffiti Youth',        file: 'GraffitiYouth-Regular.otf' },
  { label: 'Grime Slime',           file: 'GrimeSlime-Regular.ttf' },
  { label: 'Grime Dripping',        file: 'GrimeSlimeDripping-Regular.ttf' },
  { label: 'Lidakz',                file: 'LidakzOne_PERSONAL_USE_ONLY.otf' },
  { label: 'Mars Neven',            file: 'MARSNEVENEKSK-Regular.otf' },
  { label: 'Mars Neven Clean',      file: 'MARSNEVENEKSK-Clean.otf' },
  { label: 'Meltdown Phantom',      file: 'MeltdownPhantom.ttf' },
  { label: 'Meltdown Phantom Drip', file: 'MeltdownPhantom-Drip.ttf' },
  { label: 'Meltdown Swash',        file: 'MeltdownPhantomSwash.ttf' },
  { label: 'Meltdown Swash Drip',   file: 'MeltdownPhantomSwash-Drip.ttf' },
  { label: 'Muro SP',               file: 'MURO_SP.otf' },
  { label: 'Next Ups',              file: 'Next Ups.ttf' },
  { label: 'Next Ups Black',        file: 'Next Ups Black.ttf' },
  { label: 'Noctra Outline',        file: 'NoctraDrip-Outline.ttf' },
  { label: 'Noctra Outline Melt',   file: 'NoctraDrip-OutlineMelt.ttf' },
  { label: 'Noctra Solid',          file: 'NoctraDrip-Solid.ttf' },
  { label: 'Noctra Solid Melt',     file: 'NoctraDrip-SolidMelt.ttf' },
  { label: 'Seven Venom',           file: 'Seven Venom.ttf' },
  { label: 'Seven Venom Drip',      file: 'Seven Venom - Drip.ttf' },
  { label: 'Splatink',              file: 'Splatink_PERSONAL_USE_ONLY.otf' },
  { label: 'Urban Heroes',          file: 'Urban Heroes.ttf' },
  { label: 'Vandal Wupz',          file: 'Vandal Wupz.ttf' },
]

const NEON_COLORS = ['#39ff14','#ff2d78','#ffd700','#bc13fe','#00d4ff','#ff6600','#ffffff','#000000']
const SHADOW_PRESETS = ['rgba(0,0,0,0.9)','#ff2d78','#39ff14','#bc13fe','#ffd700','#00d4ff','#ff6600','#ffffff']

const QUICK_TEXTS = [
  'REAGE! 🔥','BOM DIA! ☀️','AMEI! 💜','SIM! ✅','MANDA! 📲',
  'É ELA! 👑','VIRAL!','SALVA AÍ!','ARRASTA PRA CIMA ⬆️','COMPARTILHA! 📤',
]

/* ─── templates prontos ──────────────────────────────────── */
const TEMPLATES = [
  {
    id: 'reage', name: '🔥 REAGE!', bg: 'dark',
    elements: [
      { type:'emoji', text:'🔥', x:112, y:150, size:72, rot:0, opacity:1, shadowBlur:14, shadowOffsetX:0, shadowOffsetY:0, shadowColor:'#ff6600' },
      { type:'text', text:'REAGE!', x:112, y:230, size:52, font:'"Bebas Neue", sans-serif', color:'#ff2d78', neon:true, stroke:true, bold:true, rot:0, opacity:1, align:'center', letterSpacing:3, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
    ],
  },
  {
    id: 'viral', name: '📲 VAI VIRAL!', bg: 'neon-green',
    elements: [
      { type:'text', text:'ISSO AQUI', x:112, y:168, size:34, font:'"Bebas Neue", sans-serif', color:'#39ff14', neon:true, stroke:true, bold:true, rot:0, opacity:1, align:'center', letterSpacing:2, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
      { type:'text', text:'VAI VIRAL!', x:112, y:218, size:46, font:'"Bebas Neue", sans-serif', color:'#ffffff', neon:false, stroke:true, bold:true, rot:0, opacity:1, align:'center', letterSpacing:2, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
      { type:'emoji', text:'📲', x:112, y:288, size:56, rot:0, opacity:1, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)' },
    ],
  },
  {
    id: 'salva', name: '💾 SALVA AÍ!', bg: 'neon-pink',
    elements: [
      { type:'text', text:'SALVA AÍ!', x:112, y:200, size:48, font:'"Bebas Neue", sans-serif', color:'#ffd700', neon:true, stroke:true, bold:true, rot:0, opacity:1, align:'center', letterSpacing:2, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
      { type:'emoji', text:'💾', x:112, y:272, size:60, rot:0, opacity:1, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)' },
    ],
  },
  {
    id: 'arrasta', name: '⬆️ ARRASTA!', bg: 'ocean',
    elements: [
      { type:'text', text:'ARRASTA', x:112, y:180, size:46, font:'"Bebas Neue", sans-serif', color:'#00d4ff', neon:true, stroke:true, bold:true, rot:0, opacity:1, align:'center', letterSpacing:2, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
      { type:'text', text:'PRA CIMA', x:112, y:228, size:46, font:'"Bebas Neue", sans-serif', color:'#00d4ff', neon:true, stroke:true, bold:true, rot:0, opacity:1, align:'center', letterSpacing:2, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
      { type:'emoji', text:'⬆️', x:112, y:296, size:56, rot:0, opacity:1, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)' },
    ],
  },
  {
    id: 'segueme', name: '👑 SEGUE!', bg: 'neon-pink',
    elements: [
      { type:'emoji', text:'👑', x:112, y:140, size:64, rot:0, opacity:1, shadowBlur:16, shadowOffsetX:0, shadowOffsetY:0, shadowColor:'#ffd700' },
      { type:'text', text:'SEGUE', x:112, y:218, size:52, font:'"Bebas Neue", sans-serif', color:'#ffffff', neon:false, stroke:true, bold:true, rot:0, opacity:1, align:'center', letterSpacing:4, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
      { type:'text', text:'a conta! ✨', x:112, y:256, size:26, font:'"Rajdhani", sans-serif', color:'#ffd700', neon:false, stroke:false, bold:false, rot:0, opacity:1, align:'center', letterSpacing:0, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
    ],
  },
  {
    id: 'amei', name: '💜 AMEI!', bg: 'neon-purple',
    elements: [
      { type:'emoji', text:'💜', x:112, y:148, size:80, rot:0, opacity:1, shadowBlur:20, shadowOffsetX:0, shadowOffsetY:0, shadowColor:'#bc13fe' },
      { type:'text', text:'AMEI! 😍', x:112, y:244, size:44, font:'"Bebas Neue", sans-serif', color:'#ffffff', neon:false, stroke:false, bold:true, rot:0, opacity:1, align:'center', letterSpacing:2, shadowBlur:8, shadowOffsetX:0, shadowOffsetY:2, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
    ],
  },
  {
    id: 'compartilha', name: '📤 COMPARTILHA!', bg: 'graffiti',
    elements: [
      { type:'text', text:'COMPARTILHA!', x:112, y:194, size:34, font:'"Bebas Neue", sans-serif', color:'#bc13fe', neon:true, stroke:true, bold:true, rot:0, opacity:1, align:'center', letterSpacing:2, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
      { type:'emoji', text:'📤', x:112, y:268, size:60, rot:0, opacity:1, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)' },
    ],
  },
  {
    id: 'bomdia', name: '☀️ BOM DIA!', bg: 'gold',
    elements: [
      { type:'emoji', text:'☀️', x:112, y:148, size:72, rot:0, opacity:1, shadowBlur:18, shadowOffsetX:0, shadowOffsetY:0, shadowColor:'#ffd700' },
      { type:'text', text:'BOM DIA! 🌟', x:112, y:240, size:38, font:'"Bebas Neue", sans-serif', color:'#ffd700', neon:true, stroke:true, bold:true, rot:0, opacity:1, align:'center', letterSpacing:2, shadowBlur:0, shadowOffsetX:0, shadowOffsetY:3, shadowColor:'rgba(0,0,0,0.9)', bgHighlight:null, bgHighlightOpacity:0.7 },
    ],
  },
]

/* ─── Google Fonts curated list ──────────────────────────── */
const GOOGLE_FONT_CATS = [
  { id: 'graffiti',   label: '🎨', name: 'Graffiti', fonts: [
    'Rock Salt','Bangers','Boogaloo','Cabin Sketch','Kranky','Finger Paint',
    'Fredericka the Great','Rubik Dirt','Rubik Vinyl','Rubik Burned',
    'Bungee Shade','Luckiest Guy','Titan One','Chango','Chewy',
  ]},
  { id: 'urban',      label: '🏙️', name: 'Urban', fonts: [
    'Anton','Black Ops One','Righteous','Russo One','Staatliches','Bungee',
    'Faster One','Graduate','Ultra','Alfa Slab One','Oswald','Squada One',
    'Big Shoulders Display','Teko','Roadrage','Saira Condensed',
    'Rammetto One','Carter One','Stint Ultra Condensed',
  ]},
  { id: 'horror',     label: '💀', name: 'Horror', fonts: [
    'Creepster','Eater','Butcherman','Nosifer','Metal Mania','Henny Penny',
    'Ewert','Lacquer','Sancreek','Jolly Lodger',
    'Rubik Glitch','Rubik Moonrocks','Rubik Wet Paint',
  ]},
  { id: 'futurista',  label: '🚀', name: 'Futurista', fonts: [
    'Audiowide','Michroma','Exo 2','Share Tech Mono','VT323','Press Start 2P',
    'Electrolize','Iceland','Oxanium','Chakra Petch','Quantico','Aldrich',
    'Unica One','Nova Square','Space Mono','DotGothic16',
  ]},
  { id: 'manuscrita', label: '✍️', name: 'Manuscrita', fonts: [
    'Pacifico','Lobster','Dancing Script','Satisfy','Kaushan Script','Sacramento',
    'Caveat','Indie Flower','Shadows Into Light','Handlee','Amatic SC',
    'Bad Script','Allura','Great Vibes','Cookie','Yellowtail',
    'Pinyon Script','Alex Brush','Courgette','Parisienne','Marck Script',
  ]},
  { id: 'estilo',     label: '🌟', name: 'Estilo', fonts: [
    'Monoton','Rye','Pirata One','Special Elite','UnifrakturMaguntia','Cinzel Decorative',
    'Almendra Display','Caesar Dressing','Metamorphous','Uncial Antiqua',
  ]},
]

/* ─── helpers ────────────────────────────────────────────── */
function hitTest(el, x, y) {
  const hw = el.w / 2, hh = el.h / 2
  const cos = Math.cos(-el.rot), sin = Math.sin(-el.rot)
  const dx = x - el.x, dy = y - el.y
  const lx = cos * dx - sin * dy
  const ly = sin * dx + cos * dy
  return Math.abs(lx) <= hw && Math.abs(ly) <= hh
}

function measureText(ctx, el) {
  ctx.font = `${el.bold ? 'bold ' : ''}${el.size}px ${el.font}`
  ctx.letterSpacing = el.letterSpacing ? `${el.letterSpacing}px` : '0px'
  const m = ctx.measureText(el.text)
  ctx.letterSpacing = '0px'
  return { w: m.width + 24, h: el.size + 18 }
}

function renderEl(ctx, el, selected) {
  ctx.save()
  ctx.globalAlpha = el.opacity ?? 1
  ctx.translate(el.x, el.y)
  ctx.rotate(el.rot)

  if (el.type === 'text') {
    ctx.font = `${el.bold ? 'bold ' : ''}${el.size}px ${el.font}`
    if (el.letterSpacing) ctx.letterSpacing = `${el.letterSpacing}px`
    const align = el.align || 'center'
    ctx.textAlign = align
    ctx.textBaseline = 'middle'

    // Background highlight — own opacity independent of element opacity
    if (el.bgHighlight) {
      const m = ctx.measureText(el.text)
      const bw = m.width + 24
      const bh = el.size + 14
      const bx = align === 'center' ? -bw/2 : align === 'right' ? -bw + 12 : -12
      ctx.save()
      ctx.globalAlpha = (el.opacity ?? 1) * (el.bgHighlightOpacity ?? 0.7)
      ctx.fillStyle = el.bgHighlight
      ctx.beginPath()
      if (ctx.roundRect) { ctx.roundRect(bx, -bh/2, bw, bh, 6) }
      else { ctx.rect(bx, -bh/2, bw, bh) }
      ctx.fill()
      ctx.restore()
      // Reset globalAlpha back to element opacity for text drawing
      ctx.globalAlpha = el.opacity ?? 1
    }

    // Shadow (applied before drawing)
    if (!el.neon && (el.shadowBlur || 0) > 0) {
      ctx.shadowColor  = el.shadowColor  || 'rgba(0,0,0,0.9)'
      ctx.shadowBlur   = el.shadowBlur
      ctx.shadowOffsetX = el.shadowOffsetX ?? 0
      ctx.shadowOffsetY = el.shadowOffsetY ?? 3
    }
    if (el.neon) { ctx.shadowColor = el.color; ctx.shadowBlur = 18 }

    if (el.stroke) {
      ctx.strokeStyle = el.color === '#000000' ? '#fff' : '#000'
      ctx.lineWidth = el.size / 8
      ctx.lineJoin = 'round'
      ctx.strokeText(el.text, 0, 0)
    }
    ctx.fillStyle = el.color
    ctx.fillText(el.text, 0, 0)
    ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0
    if (el.letterSpacing) ctx.letterSpacing = '0px'
  }

  if (el.type === 'emoji') {
    if ((el.shadowBlur || 0) > 0) {
      ctx.shadowColor  = el.shadowColor  || 'rgba(0,0,0,0.9)'
      ctx.shadowBlur   = el.shadowBlur
      ctx.shadowOffsetX = el.shadowOffsetX ?? 0
      ctx.shadowOffsetY = el.shadowOffsetY ?? 3
    }
    ctx.font = `${el.size}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(el.text, 0, 0)
    ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0
  }

  if (selected) {
    ctx.globalAlpha = 1
    ctx.strokeStyle = '#39ff14'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 3])
    ctx.strokeRect(-el.w/2-4, -el.h/2-4, el.w+8, el.h+8)
    ctx.setLineDash([])
    // delete handle (top-left) — vermelho com ✕
    ctx.beginPath(); ctx.arc(-el.w/2-14, -el.h/2-14, 9, 0, Math.PI*2)
    ctx.fillStyle='#ff2d78'; ctx.fill()
    ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.lineWidth=1; ctx.stroke()
    ctx.font='bold 11px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText('✕', -el.w/2-14, -el.h/2-14)
    // rotate handle (top-right)
    ctx.beginPath(); ctx.arc(el.w/2+14, -el.h/2-14, 9, 0, Math.PI*2)
    ctx.fillStyle='#39ff14'; ctx.fill()
    ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.lineWidth=1; ctx.stroke()
    ctx.font='bold 11px Arial'; ctx.fillStyle='#000'; ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText('↻', el.w/2+14, -el.h/2-14)
    // scale handle (bottom-right)
    ctx.beginPath(); ctx.arc(el.w/2+14, el.h/2+14, 9, 0, Math.PI*2)
    ctx.fillStyle='#00d4ff'; ctx.fill()
    ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.lineWidth=1; ctx.stroke()
    ctx.font='bold 11px Arial'; ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText('⤡', el.w/2+14, el.h/2+14)
  }
  ctx.restore()
}

/* ─── component ──────────────────────────────────────────── */
export default function StickerEditor({ sticker, onClose }) {
  const canvasRef       = useRef(null)
  const imgRef          = useRef(null)
  const drag            = useRef(null)
  const fontInput       = useRef(null)
  const cameraInputRef  = useRef(null)
  const requestedFonts  = useRef(new Set()) // prevents duplicate load requests

  const [elements, setElements] = useState([])
  const [selected, setSelected] = useState(null)
  const [history,  setHistory]  = useState([[]])
  const [histIdx,  setHistIdx]  = useState(0)
  const [imgLoaded,setImgLoaded]= useState(false)

  // toolbar — text
  const [text,             setText]            = useState('')
  const [fontSize,         setSize]            = useState(36)
  const [selectedFontValue,setSelectedFontValue]= useState(BASE_FONTS[0].value)
  const [fontCat,          setFontCat]         = useState('local')
  const [color,            setColor]           = useState('#39ff14')
  const [neon,          setNeon]         = useState(true)
  const [stroke,        setStroke]       = useState(true)
  const [bold,          setBold]         = useState(true)
  // toolbar — style
  const [opacity,       setOpacity]      = useState(1)
  const [letterSpacing, setLetterSpacing]= useState(0)
  const [textAlign,     setTextAlign]    = useState('center')
  const [bgHighlight,        setBgHighlight]       = useState(null)
  const [bgHighlightOpacity, setBgHighlightOpacity]= useState(0.7)
  const [shadowBlur,    setShadowBlur]   = useState(0)
  const [shadowColor,   setShadowColor]  = useState('rgba(0,0,0,0.9)')
  const [shadowOffsetX, setShadowOffsetX]= useState(0)
  const [shadowOffsetY, setShadowOffsetY]= useState(3)
  // ui
  const [panel,      setPanel]     = useState('text')
  const [emojiCat,   setEmojiCat]  = useState('caras')
  const [bgId,       setBgId]      = useState('black')
  const [exported,   setExported]  = useState(false)
  const [bgRemoving, setBgRemoving]= useState(false)
  const [showShare,  setShowShare] = useState(false)
  const [shareBlob,  setShareBlob] = useState(null)
  const [shareUrl,   setShareUrl]  = useState(null)
  const [imgVersion, setImgVersion]= useState(0)
  const [customFonts,      setCustomFonts]      = useState([])
  const [localFonts,       setLocalFonts]       = useState([])
  const [googleLoadedFonts,setGoogleLoadedFonts]= useState([])
  const [googleFontStatus, setGoogleFontStatus] = useState({}) // {fontName: 'loading'|'loaded'|'error'}
  const [fontLoadVersion,  setFontLoadVersion]  = useState(0)

  const isCreateMode = !sticker
  const allFonts = useMemo(
    () => [...BASE_FONTS, ...localFonts, ...customFonts, ...googleLoadedFonts],
    [localFonts, customFonts, googleLoadedFonts]
  )
  // All local fonts for the 'local' tab
  const localTabFonts = useMemo(
    () => [...BASE_FONTS, ...localFonts, ...customFonts],
    [localFonts, customFonts]
  )

  /* auto-load fonts from public/fonts/ */
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const loaded = []
      for (const f of LOCAL_FONTS) {
        try {
          const face = new FontFace(f.label, `url(/fonts/${encodeURIComponent(f.file)})`)
          await face.load()
          document.fonts.add(face)
          loaded.push({ label: f.label, value: `"${f.label}", sans-serif`, local: true })
        } catch {
          // fonte não encontrada ou inválida — silencia
        }
      }
      if (!cancelled) setLocalFonts(loaded)
    }
    load()
    return () => { cancelled = true }
  }, [])

  /* bg preview urls — computed once */
  const bgPreviews = useMemo(() => {
    return BG_PRESETS.map(bg => {
      const c = document.createElement('canvas')
      c.width = 36; c.height = 64
      bg.draw(c.getContext('2d'), 36, 64)
      return c.toDataURL()
    })
  }, [])

  /* load image */
  useEffect(() => {
    if (isCreateMode) { setImgLoaded(true); return }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => { imgRef.current = img; setImgLoaded(true) }
    img.onerror = () => setImgLoaded(true)
    img.src = sticker.path
  }, [sticker, isCreateMode])

  /* draw */
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    if (isCreateMode) {
      const bg = BG_PRESETS.find(b => b.id === bgId) || BG_PRESETS[0]
      bg.draw(ctx, CANVAS_W, CANVAS_H)
    } else {
      const t = 20
      for (let r = 0; r < CANVAS_H / t; r++) for (let c = 0; c < CANVAS_W / t; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#1a1a1a' : '#111'
        ctx.fillRect(c * t, r * t, t, t)
      }
      if (imgRef.current) {
        const img = imgRef.current
        const s = Math.min(CANVAS_W / img.width, CANVAS_H / img.height)
        const dw = img.width * s, dh = img.height * s
        ctx.drawImage(img, (CANVAS_W - dw) / 2, (CANVAS_H - dh) / 2, dw, dh)
      }
    }

    elements.forEach((el, i) => renderEl(ctx, el, i === selected))
  }, [elements, selected, imgLoaded, imgVersion, isCreateMode, bgId, fontLoadVersion])

  useEffect(() => { draw() }, [draw])

  /* history */
  const pushHistory = useCallback((els) => {
    setHistory(h => {
      const next = [...h.slice(0, histIdx + 1), JSON.parse(JSON.stringify(els))]
      return next.slice(-30)
    })
    setHistIdx(i => Math.min(i + 1, 29))
  }, [histIdx])

  const undo = () => {
    if (histIdx <= 0) return
    setElements(JSON.parse(JSON.stringify(history[histIdx - 1])))
    setHistIdx(i => i - 1); setSelected(null)
  }
  const redo = () => {
    if (histIdx >= history.length - 1) return
    setElements(JSON.parse(JSON.stringify(history[histIdx + 1])))
    setHistIdx(i => i + 1); setSelected(null)
  }

  // Derived — must be declared before any function that uses it
  const selectedEl = selected !== null ? elements[selected] : null

  /* add text */
  const addText = (t = text) => {
    if (!t.trim()) return
    const ctx = canvasRef.current.getContext('2d')
    const f = selectedFontValue || BASE_FONTS[0].value
    const el = {
      type: 'text', text: t.trim(),
      x: CANVAS_W / 2, y: CANVAS_H / 2,
      size: fontSize, font: f,
      color, neon, stroke, bold,
      opacity, letterSpacing, align: textAlign,
      bgHighlight, bgHighlightOpacity,
      shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY,
      rot: 0, w: 0, h: 0,
    }
    const m = measureText(ctx, el); el.w = m.w; el.h = m.h
    const next = [...elements, el]
    setElements(next); pushHistory(next); setSelected(next.length - 1)
    if (t === text) setText('')
  }

  /* add emoji */
  const addEmoji = (em) => {
    const el = {
      type: 'emoji', text: em,
      x: CANVAS_W/2, y: CANVAS_H/2,
      size: 56, rot: 0, w: 62, h: 62,
      opacity,
      shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY,
    }
    const next = [...elements, el]
    setElements(next); pushHistory(next); setSelected(next.length - 1)
  }

  /* delete selected */
  const deleteSelected = () => {
    if (selected === null) return
    const next = elements.filter((_, i) => i !== selected)
    setElements(next); pushHistory(next); setSelected(null)
  }

  /* move layer */
  const doMoveLayer = useCallback((dir, forceIdx) => {
    const idx = forceIdx ?? selected
    if (idx === null || idx === undefined) return
    const next = [...elements]
    const i = idx
    let newSel = i
    if (dir === 'up' && i < next.length - 1) {
      ;[next[i], next[i+1]] = [next[i+1], next[i]]; newSel = i + 1
    } else if (dir === 'down' && i > 0) {
      ;[next[i], next[i-1]] = [next[i-1], next[i]]; newSel = i - 1
    } else if (dir === 'top') {
      const [el] = next.splice(i, 1); next.push(el); newSel = next.length - 1
    } else if (dir === 'bottom') {
      const [el] = next.splice(i, 1); next.unshift(el); newSel = 0
    }
    setElements(next); setSelected(newSel); pushHistory(next)
  }, [elements, selected, pushHistory])

  /* update selected */
  const updateSelected = (patch) => {
    if (selected === null) return
    setElements(prev => {
      const next = prev.map((el, i) => {
        if (i !== selected) return el
        const u = { ...el, ...patch }
        if (u.type === 'text') {
          const ctx = canvasRef.current.getContext('2d')
          const m = measureText(ctx, u); u.w = m.w; u.h = m.h
        }
        return u
      })
      pushHistory(next)
      return next
    })
  }

  /* pointer helpers */
  const getPos = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const r = canvasRef.current.getBoundingClientRect()
    const sc = CANVAS_W / r.width
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    return { x: (cx - r.left) * sc, y: (cy - r.top) * sc }
  }

  const onPointerDown = (e) => {
    e.preventDefault()
    const { x, y } = getPos(e)

    if (selected !== null) {
      const el = elements[selected]
      const cos = Math.cos(el.rot), sin = Math.sin(el.rot)
      // delete handle (top-left)
      const dhx = el.x + cos*(-el.w/2-14) - sin*(-el.h/2-14)
      const dhy = el.y + sin*(-el.w/2-14) + cos*(-el.h/2-14)
      if (Math.hypot(x-dhx, y-dhy) < 14) { deleteSelected(); return }
      // rotate handle (top-right)
      const rhx = el.x + cos*(el.w/2+14) - sin*(-el.h/2-14)
      const rhy = el.y + sin*(el.w/2+14) + cos*(-el.h/2-14)
      const shx = el.x + cos*(el.w/2+14) - sin*(el.h/2+14)
      const shy = el.y + sin*(el.w/2+14) + cos*(el.h/2+14)
      if (Math.hypot(x-rhx, y-rhy) < 14) { drag.current={mode:'rotate',ox:x,oy:y,startRot:el.rot,idx:selected}; return }
      if (Math.hypot(x-shx, y-shy) < 14) { drag.current={mode:'scale',ox:x,oy:y,startSize:el.size,startW:el.w,startH:el.h,idx:selected}; return }
    }

    for (let i = elements.length - 1; i >= 0; i--) {
      if (hitTest(elements[i], x, y)) {
        setSelected(i)
        drag.current = { mode:'move', ox:x-elements[i].x, oy:y-elements[i].y, idx:i }
        return
      }
    }
    setSelected(null)
  }

  const onPointerMove = useCallback((e) => {
    // Capture drag snapshot immediately — drag.current may become null inside async setElements callback
    const d = drag.current
    if (!d) return
    e.preventDefault()
    const { x, y } = getPos(e)
    const { mode, idx, ox, oy, startSize, startW, startH } = d

    setElements(prev => prev.map((el, i) => {
      if (i !== idx) return el
      if (mode === 'move') return { ...el, x: x - ox, y: y - oy }
      if (mode === 'rotate') {
        const angle = Math.atan2(y - el.y, x - el.x)
        return { ...el, rot: angle - Math.atan2(-el.h/2-14, el.w/2+14) }
      }
      if (mode === 'scale') {
        const dist  = Math.hypot(x - el.x, y - el.y)
        const dist0 = Math.hypot(ox - el.x, oy - el.y)
        const ratio = Math.max(0.3, dist / Math.max(dist0, 1))
        const newSize = Math.round(Math.max(10, startSize * ratio))
        return { ...el, size: newSize, w: startW * ratio, h: startH * ratio }
      }
      return el
    }))
  }, [])

  const onPointerUp = useCallback(() => {
    if (drag.current) { pushHistory(elements); drag.current = null }
  }, [elements, pushHistory])

  /* font upload */
  const handleFontUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files)
    const loaded = []
    for (const file of files) {
      try {
        const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        const url  = URL.createObjectURL(file)
        const face = new FontFace(name, `url(${url})`)
        await face.load()
        document.fonts.add(face)
        loaded.push({ label: name, value: `"${name}", sans-serif`, custom: true })
      } catch (err) { console.warn('Font load error:', err) }
    }
    if (loaded.length) {
      setCustomFonts(prev => [...prev, ...loaded])
      setSelectedFontValue(loaded[0].value)
      if (selectedEl?.type === 'text') updateSelected({ font: loaded[0].value })
      setFontCat('local')
    }
    e.target.value = ''
  }, [allFonts.length, selectedEl, updateSelected])

  /* load a Google Font on demand */
  const loadGoogleFont = useCallback(async (name) => {
    if (requestedFonts.current.has(name)) return  // already requested — skip
    requestedFonts.current.add(name)
    setGoogleFontStatus(prev => ({ ...prev, [name]: 'loading' }))
    try {
      const id = `gfont-${name.replace(/\s+/g, '-').toLowerCase()}`
      if (!document.getElementById(id)) {
        const link = document.createElement('link')
        link.id = id; link.rel = 'stylesheet'
        link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/\s+/g, '+')}&display=swap`
        document.head.appendChild(link)
      }
      await document.fonts.load(`700 16px "${name}"`)
      setGoogleFontStatus(prev => ({ ...prev, [name]: 'loaded' }))
      setGoogleLoadedFonts(prev =>
        prev.find(f => f.label === name) ? prev
          : [...prev, { label: name, value: `"${name}", sans-serif`, google: true }]
      )
      setFontLoadVersion(v => v + 1)
    } catch {
      requestedFonts.current.delete(name)  // allow retry on error
      setGoogleFontStatus(prev => ({ ...prev, [name]: 'error' }))
    }
  }, [])

  /* auto-load all fonts when switching to a Google Font category */
  useEffect(() => {
    const cat = GOOGLE_FONT_CATS.find(c => c.id === fontCat)
    if (!cat) return
    cat.fonts.forEach(name => loadGoogleFont(name))
  }, [fontCat, loadGoogleFont])

  /* select font (local or google) */
  const selectFont = useCallback(async (fontValue, googleName = null) => {
    setSelectedFontValue(fontValue)
    if (selectedEl?.type === 'text') updateSelected({ font: fontValue })
    if (googleName && googleFontStatus[googleName] !== 'loaded' && googleFontStatus[googleName] !== 'loading') {
      await loadGoogleFont(googleName)
    }
  }, [selectedEl, updateSelected, googleFontStatus, loadGoogleFont])

  /* export */
  const exportSticker = async () => {
    setSelected(null)
    await new Promise(r => setTimeout(r, 60))

    const exp = document.createElement('canvas')
    exp.width = EXPORT_W; exp.height = EXPORT_H
    const ctx = exp.getContext('2d')

    if (!isCreateMode && imgRef.current) {
      const img = imgRef.current
      const s  = Math.min(EXPORT_W / img.width, EXPORT_H / img.height)
      const dw = img.width * s, dh = img.height * s
      ctx.drawImage(img, (EXPORT_W - dw) / 2, (EXPORT_H - dh) / 2, dw, dh)
    } else if (isCreateMode) {
      const bg = BG_PRESETS.find(b => b.id === bgId) || BG_PRESETS[0]
      bg.draw(ctx, EXPORT_W, EXPORT_H)
    }

    elements.forEach(el => {
      const scaled = { ...el, x: el.x*RATIO, y: el.y*RATIO, size: el.size*RATIO, w: el.w*RATIO, h: el.h*RATIO,
        shadowBlur: (el.shadowBlur||0)*RATIO, shadowOffsetX: (el.shadowOffsetX||0)*RATIO, shadowOffsetY: (el.shadowOffsetY||0)*RATIO,
        letterSpacing: (el.letterSpacing||0)*RATIO }
      renderEl(ctx, scaled, false)
    })

    // marca d'água sutil
    ctx.save()
    ctx.globalAlpha = 0.18
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${Math.round(EXPORT_W * 0.022)}px Arial`
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText('figurinhas.app', EXPORT_W - 28, EXPORT_H - 28)
    ctx.restore()

    exp.toBlob(blob => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      setShareBlob(blob)
      setShareUrl(url)
      setShowShare(true)
    }, 'image/png')
  }

  /* share actions */
  const shareNative = async () => {
    if (!shareBlob) return
    const file = new File([shareBlob], 'figurinha.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Figurinha', text: 'Criado em figurinhas.app 🔥' })
        return
      } catch {}
    }
    // fallback: baixar
    const a = document.createElement('a')
    a.href = shareUrl; a.download = 'figurinha.png'; a.click()
  }

  const copyToClipboard = async () => {
    if (!shareBlob) return
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': shareBlob })])
      setExported(true); setTimeout(() => setExported(false), 2000)
    } catch {
      const a = document.createElement('a')
      a.href = shareUrl; a.download = 'figurinha.png'; a.click()
    }
  }

  const downloadImage = () => {
    if (!shareUrl) return
    const a = document.createElement('a')
    a.href = shareUrl; a.download = 'figurinha.png'; a.click()
  }

  const closeShare = () => {
    setShowShare(false)
    if (shareUrl) { URL.revokeObjectURL(shareUrl); setShareUrl(null) }
    setShareBlob(null)
  }

  /* remove background */
  const removeBg = async () => {
    if (!imgRef.current) return
    setBgRemoving(true)
    try {
      // export current image to blob to avoid CORS issues
      const tmp = document.createElement('canvas')
      tmp.width  = imgRef.current.naturalWidth  || imgRef.current.width  || 400
      tmp.height = imgRef.current.naturalHeight || imgRef.current.height || 400
      tmp.getContext('2d').drawImage(imgRef.current, 0, 0)
      const srcBlob = await new Promise(r => tmp.toBlob(r, 'image/png'))

      const { removeBackground } = await import('@imgly/background-removal')
      const result = await removeBackground(srcBlob)
      const url    = URL.createObjectURL(result)
      const img    = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => { imgRef.current = img; setImgLoaded(true); setImgVersion(v => v + 1) }
      img.src = url
    } catch (e) {
      console.error('BG removal failed:', e)
    }
    setBgRemoving(false)
  }

  /* camera / file input */
  const handleCameraFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { imgRef.current = img; setImgLoaded(true); setImgVersion(v => v + 1) }
    img.src = url
    e.target.value = ''
  }

  /* apply template */
  const applyTemplate = useCallback((tpl) => {
    const ctx = canvasRef.current?.getContext('2d')
    const els = tpl.elements.map(el => {
      if (el.type === 'text' && ctx) {
        const m = measureText(ctx, el)
        return { ...el, w: m.w, h: m.h }
      }
      return { ...el, w: el.size * 1.2, h: el.size * 1.2 }
    })
    setBgId(tpl.bg || 'dark')
    setElements(els)
    pushHistory(els)
    setSelected(null)
    setPanel('text')
  }, [pushHistory])

  // helpers to get effective value (selected element or toolbar default)
  const eff = (key, def) => selectedEl ? (selectedEl[key] ?? def) : def

  return (
    <div className="editor-backdrop">
      <motion.div
        className="editor-box"
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1,    opacity: 1, y: 0 }}
        exit={{    scale: 0.92, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      >
        {/* ── header ── */}
        <div className="editor-header">
          <span className="editor-title">{isCreateMode ? '🎨 CRIAR FIGURINHA' : '✏️ EDITOR'}</span>
          <div className="editor-header-actions">
            <button className="editor-undo-btn" onClick={undo} disabled={histIdx <= 0} title="Desfazer">↩</button>
            <button className="editor-undo-btn" onClick={redo} disabled={histIdx >= history.length-1} title="Refazer">↪</button>
            {selected !== null && (
              <>
                <div className="editor-layer-divider" />
                <button className="editor-layer-btn editor-center-btn"
                  onClick={() => updateSelected({ x: CANVAS_W/2, y: CANVAS_H/2 })}
                  title="Centralizar no canvas"
                >⊕</button>
                <div className="editor-layer-divider" />
                <button className="editor-layer-btn" onClick={() => doMoveLayer('bottom')} title="Enviar para o fundo" disabled={selected <= 0}>⤓</button>
                <button className="editor-layer-btn" onClick={() => doMoveLayer('down')}   title="Mover para trás"    disabled={selected <= 0}>↓</button>
                <button className="editor-layer-btn" onClick={() => doMoveLayer('up')}     title="Mover para frente"  disabled={selected >= elements.length-1}>↑</button>
                <button className="editor-layer-btn" onClick={() => doMoveLayer('top')}    title="Trazer para frente" disabled={selected >= elements.length-1}>⤒</button>
                <div className="editor-layer-divider" />
                <button className="editor-del-btn" onClick={deleteSelected} title="Remover">🗑</button>
              </>
            )}
          </div>
          {/* ✕ sempre visível, fora da área scrollável */}
          <button className="editor-close-btn editor-close-fixed" onClick={onClose}>✕</button>
        </div>

        {/* ── body ── */}
        <div className="editor-body">

          {/* STORY PHONE PREVIEW */}
          <div className="editor-canvas-wrap">
            <div className="story-phone-frame">
              <div className="story-phone-notch">
                <div className="story-phone-camera" />
              </div>

              <div className="story-content-area">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  className="editor-canvas"
                  onMouseDown={onPointerDown}
                  onMouseMove={onPointerMove}
                  onMouseUp={onPointerUp}
                  onMouseLeave={onPointerUp}
                  onTouchStart={onPointerDown}
                  onTouchMove={onPointerMove}
                  onTouchEnd={onPointerUp}
                  style={{ touchAction: 'none' }}
                />

                {!imgLoaded && <div className="editor-loading">Carregando...</div>}

                {/* Instagram Story UI overlay */}
                <div className="story-ui-overlay">
                  <div className="story-top-bar">
                    <div className="story-progress-bars">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="story-progress-track">
                          <div className="story-progress-fill" style={{ width: i===0?'100%':i===1?'42%':'0%' }} />
                        </div>
                      ))}
                    </div>
                    <div className="story-user-row">
                      <div className="story-avatar">
                        <img src="/stickers/logo.png" alt="" onError={e => e.target.style.display='none'} />
                      </div>
                      <span className="story-username">@sua_conta</span>
                      <span className="story-time">agora</span>
                      <span className="story-close-icon">✕</span>
                    </div>
                  </div>
                  <div className="story-bottom-bar">
                    <div className="story-send-row">
                      <div className="story-send-input">Enviar mensagem...</div>
                      <span className="story-send-icons">
                        <span>❤️</span>
                        <span className="story-send-arrow">➤</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="story-phone-home" />
            </div>

            <div className="editor-canvas-hint">
              Toque para selecionar • Arraste para mover
            </div>

            {/* camera + bg-removal buttons */}
            <div className="editor-canvas-actions">
              <button
                className="editor-canvas-action-btn"
                onClick={() => cameraInputRef.current?.click()}
                title="Usar câmera ou galeria"
              >📷 <span>Câmera</span></button>
              {!isCreateMode && (
                <button
                  className={`editor-canvas-action-btn ${bgRemoving ? 'loading' : ''}`}
                  onClick={removeBg}
                  disabled={bgRemoving}
                  title="Remover fundo da imagem"
                >{bgRemoving ? '⏳' : '✂️'} <span>{bgRemoving ? 'Removendo...' : 'Remover fundo'}</span></button>
              )}
            </div>

            {/* hidden file/camera input */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleCameraFile}
            />
          </div>

          {/* TOOLBAR */}
          <div className="editor-toolbar">
            {/* tabs */}
            <div className="editor-tabs">
              {[
                { id: 'text',    icon: 'T',  label: 'Texto'   },
                { id: 'emoji',   icon: '😀', label: 'Emoji'   },
                { id: 'style',   icon: '✨', label: 'Estilo'  },
                { id: 'layers',  icon: '⬚',  label: 'Camadas' },
                { id: 'models',  icon: '📋', label: 'Modelos' },
                { id: 'presets', icon: '⚡', label: 'Rápido'  },
                ...(isCreateMode ? [{ id: 'bg', icon: '🎨', label: 'Fundo' }] : []),
              ].map(t => (
                <button key={t.id} className={`editor-tab ${panel===t.id?'active':''}`} onClick={() => setPanel(t.id)}>
                  <span className="editor-tab-icon">{t.icon}</span>
                  <span className="editor-tab-label">{t.label}</span>
                </button>
              ))}
            </div>

            {/* ── TEXT panel ── */}
            {panel === 'text' && (
              <div className="editor-panel">
                <div className="editor-text-row">
                  <input
                    className="editor-input"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && addText()}
                    placeholder="Digite seu texto..."
                    maxLength={40}
                  />
                  <button className="editor-add-btn" onClick={() => addText()}>+</button>
                </div>

                <div className="editor-row-label">Fonte</div>
                <div className="editor-font-browser">
                  {/* Category tabs */}
                  <div className="editor-font-cats">
                    <button
                      className={`editor-font-cat-btn ${fontCat === 'local' ? 'active' : ''}`}
                      onClick={() => setFontCat('local')}
                      title="Minhas fontes"
                    >📁 <span>Minhas</span></button>
                    {GOOGLE_FONT_CATS.map(cat => (
                      <button
                        key={cat.id}
                        className={`editor-font-cat-btn ${fontCat === cat.id ? 'active' : ''}`}
                        onClick={() => setFontCat(cat.id)}
                        title={cat.name}
                      >{cat.label} <span>{cat.name}</span></button>
                    ))}
                  </div>

                  {/* Font grid */}
                  <div className="editor-font-grid">
                    {fontCat === 'local' ? (
                      <>
                        {localTabFonts.map(f => (
                          <button
                            key={f.label}
                            className={`editor-font-item loaded ${selectedFontValue === f.value ? 'active' : ''} ${f.custom ? 'custom' : ''}`}
                            style={{ fontFamily: f.value }}
                            onClick={() => selectFont(f.value)}
                          >{f.label}</button>
                        ))}
                        <button className="editor-font-item upload-btn" onClick={() => fontInput.current?.click()}>
                          + Importar
                        </button>
                      </>
                    ) : (
                      (GOOGLE_FONT_CATS.find(c => c.id === fontCat)?.fonts || []).map(name => {
                        const value = `"${name}", sans-serif`
                        const status = googleFontStatus[name] || 'pending'
                        const isActive = selectedFontValue === value || selectedEl?.font === value
                        return (
                          <button
                            key={name}
                            className={`editor-font-item ${status} ${isActive ? 'active' : ''}`}
                            style={status === 'loaded' ? { fontFamily: value } : {}}
                            onClick={() => selectFont(value, name)}
                            title={status === 'pending' ? 'Clique para carregar' : status === 'error' ? 'Erro — tente novamente' : name}
                          >
                            {status === 'loading' ? <span className="font-spinner">⟳</span> : name}
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>
                <input ref={fontInput} type="file" accept=".ttf,.otf,.woff,.woff2" multiple onChange={handleFontUpload} style={{ display:'none' }} />

                <div className="editor-row-label">Tamanho — {eff('size', fontSize)}px</div>
                <input
                  type="range" min="10" max="96" step="2"
                  className="editor-slider"
                  value={eff('size', fontSize)}
                  onChange={e => { const v=+e.target.value; setSize(v); if (selectedEl?.type==='text') updateSelected({ size:v }) }}
                />

                <div className="editor-toggle-row">
                  {[
                    { label:'Neon',     val:selectedEl?.type==='text'?eff('neon',neon):neon,     set:setNeon,   key:'neon'   },
                    { label:'Contorno', val:selectedEl?.type==='text'?eff('stroke',stroke):stroke, set:setStroke, key:'stroke' },
                    { label:'Bold',     val:selectedEl?.type==='text'?eff('bold',bold):bold,     set:setBold,   key:'bold'   },
                  ].map(t => (
                    <button
                      key={t.label}
                      className={`editor-toggle ${t.val?'active':''}`}
                      onClick={() => { t.set(!t.val); if (selectedEl?.type==='text') updateSelected({ [t.key]:!t.val }) }}
                    >{t.label}</button>
                  ))}
                </div>

                <div className="editor-row-label">Cor do texto</div>
                <div className="editor-colors">
                  {NEON_COLORS.map(c => (
                    <button
                      key={c}
                      className={`editor-color-dot ${color===c?'active':''}`}
                      style={{ background:c, boxShadow: color===c ? `0 0 10px ${c}` : 'none', border: c==='#ffffff'?'1px solid rgba(255,255,255,0.3)':c==='#000000'?'1px solid rgba(255,255,255,0.2)':'none' }}
                      onClick={() => { setColor(c); if (selectedEl?.type==='text') updateSelected({ color:c }) }}
                    />
                  ))}
                  <input
                    type="color"
                    className="editor-color-custom"
                    value={color}
                    onChange={e => { setColor(e.target.value); if (selectedEl?.type==='text') updateSelected({ color:e.target.value }) }}
                    title="Cor personalizada"
                  />
                </div>
              </div>
            )}

            {/* ── EMOJI panel ── */}
            {panel === 'emoji' && (
              <div className="editor-panel">
                <div className="editor-emoji-cats">
                  {EMOJI_CATS.map(cat => (
                    <button
                      key={cat.id}
                      className={`editor-emoji-cat-btn ${emojiCat===cat.id?'active':''}`}
                      onClick={() => setEmojiCat(cat.id)}
                      title={cat.name}
                    >{cat.label}</button>
                  ))}
                </div>
                <div className="editor-emoji-grid">
                  {(EMOJI_CATS.find(c => c.id===emojiCat)?.emojis || []).map(em => (
                    <button key={em} className="editor-emoji-btn" onClick={() => addEmoji(em)}>{em}</button>
                  ))}
                </div>
                {selectedEl?.type==='emoji' && (
                  <>
                    <div className="editor-row-label">Tamanho — {selectedEl.size}px</div>
                    <input
                      type="range" min="24" max="120" step="4"
                      className="editor-slider"
                      value={selectedEl.size}
                      onChange={e => updateSelected({ size:+e.target.value, w:+e.target.value+6, h:+e.target.value+6 })}
                    />
                  </>
                )}
              </div>
            )}

            {/* ── STYLE panel ── */}
            {panel === 'style' && (
              <div className="editor-panel">
                {/* Opacity */}
                <div className="editor-row-label">Opacidade — {Math.round(eff('opacity', opacity) * 100)}%</div>
                <input type="range" min="0.1" max="1" step="0.05"
                  className="editor-slider"
                  value={eff('opacity', opacity)}
                  onChange={e => { const v=+e.target.value; setOpacity(v); if (selectedEl) updateSelected({ opacity:v }) }}
                />

                {/* Text align — text only */}
                {(!selectedEl || selectedEl.type === 'text') && (
                  <>
                    <div className="editor-row-label">Alinhamento</div>
                    <div className="editor-align-row">
                      {[
                        { val:'left',   icon:'⬅', label:'Esq'    },
                        { val:'center', icon:'↔', label:'Centro' },
                        { val:'right',  icon:'➡', label:'Dir'    },
                      ].map(a => (
                        <button key={a.val}
                          className={`editor-align-btn ${eff('align', textAlign) === a.val ? 'active' : ''}`}
                          onClick={() => { setTextAlign(a.val); if (selectedEl?.type==='text') updateSelected({ align:a.val }) }}
                        >{a.icon} {a.label}</button>
                      ))}
                    </div>
                  </>
                )}

                {/* Letter spacing — text only */}
                {(!selectedEl || selectedEl.type === 'text') && (
                  <>
                    <div className="editor-row-label">Espaçamento — {eff('letterSpacing', letterSpacing)}px</div>
                    <input type="range" min="0" max="20" step="1"
                      className="editor-slider"
                      value={eff('letterSpacing', letterSpacing)}
                      onChange={e => { const v=+e.target.value; setLetterSpacing(v); if (selectedEl?.type==='text') updateSelected({ letterSpacing:v }) }}
                    />
                  </>
                )}

                {/* Background highlight — text only */}
                {(!selectedEl || selectedEl.type === 'text') && (
                  <>
                    <div className="editor-row-label">Destaque de fundo</div>
                    <div className="editor-highlight-box">
                      {/* Toggle row */}
                      <div className="editor-style-toggle-row">
                        <button
                          className={`editor-toggle ${eff('bgHighlight', bgHighlight) ? 'active' : ''}`}
                          onClick={() => {
                            const cur = eff('bgHighlight', bgHighlight)
                            const newVal = cur ? null : '#000000'
                            setBgHighlight(newVal)
                            if (selectedEl?.type==='text') updateSelected({ bgHighlight: newVal })
                          }}
                        >🎨 {eff('bgHighlight', bgHighlight) ? 'Destaque ativado' : 'Ativar destaque'}</button>
                        {eff('bgHighlight', bgHighlight) && (
                          <input type="color"
                            className="editor-color-custom editor-color-swatch"
                            value={eff('bgHighlight', bgHighlight) || '#000000'}
                            onChange={e => { setBgHighlight(e.target.value); if (selectedEl?.type==='text') updateSelected({ bgHighlight:e.target.value }) }}
                            title="Cor do destaque"
                          />
                        )}
                      </div>
                      {/* Opacity slider — only when highlight is active */}
                      {eff('bgHighlight', bgHighlight) && (
                        <>
                          <div className="editor-row-label" style={{marginTop:6}}>
                            Opacidade do destaque — {Math.round(eff('bgHighlightOpacity', bgHighlightOpacity) * 100)}%
                          </div>
                          <input type="range" min="0.05" max="1" step="0.05"
                            className="editor-slider"
                            value={eff('bgHighlightOpacity', bgHighlightOpacity)}
                            onChange={e => {
                              const v = +e.target.value
                              setBgHighlightOpacity(v)
                              if (selectedEl?.type==='text') updateSelected({ bgHighlightOpacity: v })
                            }}
                          />
                          {/* Quick colors */}
                          <div className="editor-highlight-colors">
                            {['#000000','#ffffff','#ff2d78','#39ff14','#bc13fe','#ffd700','#00d4ff','#ff6600'].map(c => (
                              <button key={c}
                                className={`editor-color-dot ${eff('bgHighlight', bgHighlight) === c ? 'active' : ''}`}
                                style={{ background:c,
                                  border: c==='#ffffff'?'1px solid rgba(0,0,0,0.3)':'none',
                                  boxShadow: eff('bgHighlight', bgHighlight) === c ? `0 0 8px ${c}90` : 'none' }}
                                onClick={() => { setBgHighlight(c); if (selectedEl?.type==='text') updateSelected({ bgHighlight:c }) }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Shadow */}
                <div className="editor-row-label">Sombra</div>
                <div className="editor-style-toggle-row">
                  <button
                    className={`editor-toggle ${eff('shadowBlur', shadowBlur) > 0 ? 'active' : ''}`}
                    onClick={() => {
                      const cur = eff('shadowBlur', shadowBlur)
                      const newBlur = cur > 0 ? 0 : 12
                      setShadowBlur(newBlur)
                      if (selectedEl) updateSelected({ shadowBlur: newBlur })
                    }}
                  >💫 Ativar sombra</button>
                </div>

                {eff('shadowBlur', shadowBlur) > 0 && (
                  <>
                    <div className="editor-row-label">Intensidade — {eff('shadowBlur', shadowBlur)}</div>
                    <input type="range" min="1" max="40" step="1"
                      className="editor-slider"
                      value={eff('shadowBlur', shadowBlur)}
                      onChange={e => { const v=+e.target.value; setShadowBlur(v); if (selectedEl) updateSelected({ shadowBlur:v }) }}
                    />
                    <div className="editor-row-label">Cor da sombra</div>
                    <div className="editor-colors">
                      {SHADOW_PRESETS.map(c => (
                        <button key={c}
                          className={`editor-color-dot ${eff('shadowColor', shadowColor) === c ? 'active' : ''}`}
                          style={{ background:c === 'rgba(0,0,0,0.9)' ? '#000' : c,
                            border: c==='#ffffff'?'1px solid rgba(255,255,255,0.3)':c==='rgba(0,0,0,0.9)'?'1px solid rgba(255,255,255,0.25)':'none',
                            boxShadow: eff('shadowColor', shadowColor) === c ? `0 0 8px ${c}` : 'none' }}
                          onClick={() => { setShadowColor(c); if (selectedEl) updateSelected({ shadowColor:c }) }}
                        />
                      ))}
                    </div>
                    <div className="editor-row-label">Offset X — {eff('shadowOffsetX', shadowOffsetX)}</div>
                    <input type="range" min="-20" max="20" step="1"
                      className="editor-slider"
                      value={eff('shadowOffsetX', shadowOffsetX)}
                      onChange={e => { const v=+e.target.value; setShadowOffsetX(v); if (selectedEl) updateSelected({ shadowOffsetX:v }) }}
                    />
                    <div className="editor-row-label">Offset Y — {eff('shadowOffsetY', shadowOffsetY)}</div>
                    <input type="range" min="-20" max="20" step="1"
                      className="editor-slider"
                      value={eff('shadowOffsetY', shadowOffsetY)}
                      onChange={e => { const v=+e.target.value; setShadowOffsetY(v); if (selectedEl) updateSelected({ shadowOffsetY:v }) }}
                    />
                  </>
                )}
              </div>
            )}

            {/* ── LAYERS panel ── */}
            {panel === 'layers' && (
              <div className="editor-panel">
                {elements.length === 0 ? (
                  <div className="editor-layers-empty">
                    <span>⬚</span>
                    <span>Nenhum elemento ainda.<br/>Adicione texto ou emojis.</span>
                  </div>
                ) : (
                  <>
                    <div className="editor-layers-hint">Clique para selecionar • Use as setas para reordenar</div>
                    <div className="editor-layers-list">
                      {[...elements].map((el, i) => {
                        // render top layer first
                        const layerIdx = elements.length - 1 - i
                        const realIdx  = layerIdx
                        const isSelected = realIdx === selected
                        return (
                          <div key={realIdx}
                            className={`editor-layer-item ${isSelected ? 'active' : ''}`}
                            onClick={() => setSelected(realIdx)}
                          >
                            <span className="editor-layer-icon-big">
                              {el.type === 'emoji' ? el.text : '𝐓'}
                            </span>
                            <div className="editor-layer-info">
                              <span className="editor-layer-name">
                                {el.type === 'text' ? `"${el.text.slice(0,16)}${el.text.length>16?'…':''}"` : `Emoji ${el.text}`}
                              </span>
                              <span className="editor-layer-meta">
                                {el.type === 'text' ? `${el.size}px • ${Math.round((el.opacity??1)*100)}%` : `${el.size}px • ${Math.round((el.opacity??1)*100)}%`}
                              </span>
                            </div>
                            <div className="editor-layer-btns">
                              <button className="editor-layer-arrow"
                                onClick={e => { e.stopPropagation(); doMoveLayer('up', realIdx) }}
                                disabled={realIdx >= elements.length-1}
                                title="Mover para frente"
                              >↑</button>
                              <button className="editor-layer-arrow"
                                onClick={e => { e.stopPropagation(); doMoveLayer('down', realIdx) }}
                                disabled={realIdx <= 0}
                                title="Mover para trás"
                              >↓</button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {selected !== null && (
                      <div className="editor-layer-order-row">
                        <button className="editor-order-btn" onClick={() => doMoveLayer('bottom')} disabled={selected <= 0}>⤓ Fundo</button>
                        <button className="editor-order-btn" onClick={() => doMoveLayer('down')}   disabled={selected <= 0}>↓ Trás</button>
                        <button className="editor-order-btn" onClick={() => doMoveLayer('up')}     disabled={selected >= elements.length-1}>↑ Frente</button>
                        <button className="editor-order-btn" onClick={() => doMoveLayer('top')}    disabled={selected >= elements.length-1}>⤒ Topo</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── MODELOS panel ── */}
            {panel === 'models' && (
              <div className="editor-panel">
                <div className="editor-models-hint">Clique para aplicar um modelo pronto</div>
                <div className="editor-models-grid">
                  {TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      className="editor-model-btn"
                      onClick={() => applyTemplate(tpl)}
                    >
                      <span className="editor-model-icon">{tpl.name.split(' ')[0]}</span>
                      <span className="editor-model-name">{tpl.name.slice(tpl.name.indexOf(' ')+1)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── PRESETS panel ── */}
            {panel === 'presets' && (
              <div className="editor-panel">
                <div className="editor-presets-grid">
                  {QUICK_TEXTS.map(t => (
                    <button key={t} className="editor-preset-btn" onClick={() => addText(t)}>{t}</button>
                  ))}
                </div>
              </div>
            )}

            {/* ── BACKGROUND panel (create mode) ── */}
            {panel === 'bg' && isCreateMode && (
              <div className="editor-panel">
                <div className="editor-bg-grid">
                  {BG_PRESETS.map((bg, i) => (
                    <button
                      key={bg.id}
                      className={`editor-bg-btn ${bgId===bg.id?'active':''}`}
                      onClick={() => setBgId(bg.id)}
                      title={bg.label}
                      style={{ backgroundImage:`url(${bgPreviews[i]})`, backgroundSize:'cover' }}
                    >
                      {bgId===bg.id && <span className="editor-bg-check">✓</span>}
                    </button>
                  ))}
                </div>
                <div className="editor-bg-label">{BG_PRESETS.find(b=>b.id===bgId)?.label}</div>
                <div className="editor-bg-note">⚠️ Só visualização — export sempre sem fundo</div>
              </div>
            )}

            {/* ── export ── */}
            <button className="editor-export-btn" onClick={exportSticker}>
              🚀 Exportar Figurinha
            </button>
          </div>
        </div>

        {/* ── SHARE MODAL ── */}
        {showShare && (
          <div className="share-overlay" onClick={e => e.target === e.currentTarget && closeShare()}>
            <div className="share-modal">
              <div className="share-modal-header">
                <span className="share-modal-title">✅ Figurinha pronta!</span>
                <button className="share-modal-close" onClick={closeShare}>✕</button>
              </div>

              {shareUrl && (
                <div className="share-preview-wrap">
                  <img src={shareUrl} alt="preview" className="share-preview-img" />
                </div>
              )}

              <div className="share-actions">
                <button className="share-btn share-btn-primary" onClick={shareNative}>
                  <span>📤</span>
                  <span>Compartilhar</span>
                </button>
                <button className={`share-btn share-btn-copy ${exported ? 'done' : ''}`} onClick={copyToClipboard}>
                  <span>{exported ? '✅' : '📋'}</span>
                  <span>{exported ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <button className="share-btn share-btn-download" onClick={downloadImage}>
                  <span>⬇️</span>
                  <span>Baixar</span>
                </button>
              </div>

              <div className="share-whatsapp-row">
                <a
                  className="share-btn share-btn-whatsapp"
                  href="https://wa.me/?text=Olha%20essa%20figurinha%20que%20eu%20criei!%20figurinhas.app"
                  target="_blank"
                  rel="noreferrer"
                  onClick={shareNative}
                >
                  <span>💬</span>
                  <span>Enviar no WhatsApp</span>
                </a>
              </div>

              <p className="share-watermark-note">figurinhas.app • criado com 💚</p>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  )
}
