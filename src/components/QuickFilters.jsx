// Filtros rápidos por palavra-chave — aparece abaixo das categorias
// Clique em uma tag para buscar diretamente

const QUICK_TAGS = [
  { label: '☀️ Bom Dia',       query: 'bomdia'       },
  { label: '🌙 Boa Noite',     query: 'boa noite'    },
  { label: '🔥 Reage',         query: 'reage'        },
  { label: '😂 Humor',         query: 'humor'        },
  { label: '💪 Motivação',     query: 'marcha'       },
  { label: '🎨 Arte',          query: 'arte'         },
  { label: '👑 Grau',          query: 'grau'         },
  { label: '🛵 iFood',         query: 'ifood'        },
  { label: '❤️ Curte',         query: 'curte'        },
  { label: '😵 Louco',         query: 'louco'        },
  { label: '🙏 Jesus',         query: 'jesus'        },
  { label: '😂 Haha',          query: 'hahaha'       },
]

export default function QuickFilters({ searchQuery, onSearch, activeCategory }) {
  // Só mostra quando está em "todos" e sem busca ativa
  if (activeCategory !== 'todos' || searchQuery) return null

  return (
    <div className="quick-filters">
      <span className="quick-label">⚡ Busca rápida:</span>
      <div className="quick-tags-scroll">
        {QUICK_TAGS.map(tag => (
          <button
            key={tag.query}
            className="quick-tag"
            onClick={() => onSearch(tag.query)}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  )
}
