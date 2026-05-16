# Graph Report - SKZ-WEB  (2026-05-15)

## Corpus Check
- 10 files · ~7,412 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 86 nodes · 81 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `77a209b6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `🎵 Stray Kids Fanpage - SKZ-WEB` - 15 edges
2. `statistics` - 8 edges
3. `files` - 6 edges
4. `initCharts()` - 5 edges
5. `🚀 Inicio Rápido` - 5 edges
6. `🌐 Páginas Principales` - 4 edges
7. `📚 Librerías Utilizadas` - 3 edges
8. `setupNavigation()` - 2 edges
9. `updateActiveLink()` - 2 edges
10. `createReleasesChart()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (13 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (15): 🎯 Características, ✨ Características JavaScript, code:block1 (SKZ-WEB/), code:html (<script src="https://cdn.jsdelivr.net/npm/chart.js"></script), code:html (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/aj), 📧 Contacto, 🤝 Contribuir, 📁 Estructura del Proyecto (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (12): files, code, document, image, paper, video, graphifyignore_patterns, needs_graph (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.18
Nodes (10): albums, members, statistics, agencyName, countries, debutDate, memberCount, totalAlbums (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (5): createAlbumsPopularityChart(), createGenresChart(), createMonthlyChart(), createReleasesChart(), initCharts()

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (3): albums, setupNavigation(), updateActiveLink()

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (7): 1. Clonar el Repositorio, 2. Instalar Dependencias, 3. Iniciar Servidor Local, 4. Acceder a la Página, code:bash (git clone https://github.com/tu-usuario/SKZ-WEB.git), code:bash (# Con Python 3), 🚀 Inicio Rápido

### Community 6 - "Community 6"
Cohesion: 0.4
Nodes (4): edges, input_tokens, nodes, output_tokens

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (4): 1. **index.html** - Página Principal, 2. **dashboard.html** - Panel de Control, 3. **pages/\*.html** - Páginas de Álbumes, 🌐 Páginas Principales

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (3): code:javascript (window.SKZ_CONFIG = {), 🔧 Configuración, YouTube API

## Knowledge Gaps
- **46 isolated node(s):** `nodes`, `edges`, `input_tokens`, `output_tokens`, `code` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `🎵 Stray Kids Fanpage - SKZ-WEB` connect `Community 0` to `Community 8`, `Community 9`, `Community 5`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `🚀 Inicio Rápido` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `🌐 Páginas Principales` connect `Community 8` to `Community 0`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `nodes`, `edges`, `input_tokens` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._