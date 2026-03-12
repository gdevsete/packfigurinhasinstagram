/**
 * STICKER VAULT - Gerador de Manifesto
 * =====================================
 * Coloque suas figurinhas em: public/stickers/{categoria}/
 * Execute: npm run generate-manifest
 *
 * O script vai:
 * 1. Ler todas as pastas dentro de public/stickers/
 * 2. Gerar um manifest.json com todas as figurinhas
 * 3. Salvar em public/stickers/manifest.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STICKERS_DIR = path.join(__dirname, '..', 'public', 'stickers')
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'manifest.json')

const SUPPORTED_EXTS = ['.png', '.gif', '.webp', '.jpg', '.jpeg', '.svg', '.avif']

// Emojis automáticos por categoria (personalize!)
const CATEGORY_META = {
  // pastas antigas
  memes:             { emoji: '😂', color: '#ffd700',  name: 'Memes'           },
  emojis:            { emoji: '🔥', color: '#ff6b35',  name: 'Emojis'          },
  animados:          { emoji: '🎬', color: '#bc13fe',  name: 'Animados'        },
  motivacional:      { emoji: '💪', color: '#00d4ff',  name: 'Motivacional'    },
  amor:              { emoji: '💕', color: '#ff2d78',  name: 'Amor'            },
  natureza:          { emoji: '🌿', color: '#39ff14',  name: 'Natureza'        },
  festa:             { emoji: '🎉', color: '#ffd700',  name: 'Festa'           },
  figurinhas:        { emoji: '✨', color: '#39ff14',  name: 'Figurinhas'      },
  'mais-aqui':       { emoji: '➕', color: '#aaaaaa',  name: 'Mais'            },
  // pastas novas
  'bom-dia':         { emoji: '☀️', color: '#ffd700',  name: 'Bom Dia'         },
  'boa-tarde':       { emoji: '🌤️', color: '#ff6b35',  name: 'Boa Tarde'       },
  'boa-noite':       { emoji: '🌙', color: '#bc13fe',  name: 'Boa Noite'       },
  'dias-da-semana':  { emoji: '📅', color: '#00d4ff',  name: 'Dias da Semana'  },
  domingrau:         { emoji: '🏍️', color: '#ff2d78',  name: 'Domingrau'       },
  '99-ifood-uber':   { emoji: '🛵', color: '#ea1d2c',  name: 'iFood & Uber'    },
  sombras:           { emoji: '🌑', color: '#6644aa',  name: 'Sombras'         },
  'insta-metas':     { emoji: '📈', color: '#39ff14',  name: 'Metas Instagram' },
  'memes-e-frases':  { emoji: '💬', color: '#ffd700',  name: 'Memes & Frases'  },
  reacoes:           { emoji: '🔥', color: '#ff6b35',  name: 'Reações'         },
  'para-plataforma': { emoji: '📲', color: '#00d4ff',  name: 'Para Plataforma' },
  interativos:       { emoji: '👆', color: '#bc13fe',  name: 'Interativos'     },
  extra:             { emoji: '💎', color: '#a0a0a0',  name: 'Extra'           },
  default:           { emoji: '✨', color: '#39ff14',  name: null              },
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function slugify(str) {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos: ção→cao
    .toLowerCase()
    .replace(/[()[\]]/g, '')                          // remove parênteses
    .replace(/[\s_]+/g, '-')                          // espaços → hífen
    .replace(/[^a-z0-9-]/g, '')                       // remove demais especiais
    .replace(/-+/g, '-')                              // colapsa hífens duplos
    .replace(/^-|-$/g, '')                            // remove hífens nas bordas
}

function scanDirectory(dir) {
  const stickers = []
  const categories = []

  if (!fs.existsSync(dir)) {
    console.error(`❌ Diretório não encontrado: ${dir}`)
    process.exit(1)
  }

  const folders = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'node_modules')

  if (folders.length === 0) {
    console.warn('⚠️  Nenhuma pasta de categoria encontrada em public/stickers/')
    console.warn('   Crie pastas como: public/stickers/memes/, public/stickers/emojis/, etc.')
  }

  folders.forEach(folder => {
    const catId = slugify(folder.name)
    const meta = CATEGORY_META[catId] || CATEGORY_META.default
    const catPath = path.join(dir, folder.name)

    const files = fs.readdirSync(catPath, { withFileTypes: true })
      .filter(f => f.isFile() && SUPPORTED_EXTS.includes(path.extname(f.name).toLowerCase()))

    if (files.length === 0) return

    categories.push({
      id: catId,
      name: meta.name || capitalize(folder.name),
      emoji: meta.emoji,
      color: meta.color,
      count: files.length,
    })

    files.forEach((file, i) => {
      const name = path.basename(file.name, path.extname(file.name))
      const webPath = `/stickers/${folder.name}/${file.name}`

      stickers.push({
        id: `${catId}-${i}`,
        path: webPath,
        category: catId,
        name: name,
        tags: [catId, ...name.toLowerCase().split(/[-_\s]+/)].filter(Boolean),
      })
    })

    console.log(`  ✅ ${capitalize(folder.name)}: ${files.length} figurinhas`)
  })

  return { stickers, categories }
}

console.log('\n🎨 STICKER VAULT - Gerando manifesto...\n')
console.log(`📁 Lendo: ${STICKERS_DIR}\n`)

const { stickers, categories } = scanDirectory(STICKERS_DIR)

const manifest = {
  generated: new Date().toISOString(),
  totalCount: stickers.length,
  categories: [
    { id: 'todos', name: 'Todos', emoji: '✨', color: '#39ff14' },
    ...categories,
    { id: 'favoritos', name: 'Favoritos', emoji: '❤️', color: '#ff2d78' },
  ],
  stickers,
}

fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2), 'utf-8')

console.log(`\n✨ Manifesto gerado com sucesso!`)
console.log(`   📦 Total: ${stickers.length} figurinhas`)
console.log(`   🗂️  Categorias: ${categories.length}`)
console.log(`   📄 Arquivo: src/data/manifest.json\n`)

if (stickers.length === 0) {
  console.warn('⚠️  Nenhuma figurinha encontrada!')
  console.warn('   Coloque seus arquivos PNG/GIF/WebP em:')
  console.warn('   public/stickers/{categoria}/arquivo.png\n')
}
