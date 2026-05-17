# 🎵 Stray Kids Fanpage - SKZ-WEB

> Una fanpage profesional y moderna de Stray Kids con HTML5, CSS3, JavaScript, Chart.js y YouTube API v3

## 🎯 Características

- ✨ **Diseño Responsivo** - Adaptable a todos los dispositivos
- 🎨 **Tema Visual Moderno** - Negro, rojo y blanco con efectos glow
- 📊 **Dashboard Interactivo** - Gráficos con Chart.js
- 🎬 **Integración YouTube API** - Búsqueda de videos en tiempo real
- 🎵 **Discografía Completa** - Información de 5 álbumes principales
- 👥 **Perfiles de Miembros** - Estadísticas y datos de los 8 miembros
- ⚡ **Animaciones Suaves** - Transiciones y efectos visuales modernos

## 📁 Estructura del Proyecto

```
SKZ-WEB/
├── index.html              # Página principal
├── dashboard.html          # Panel de estadísticas
│
├── css/
│   ├── style.css          # Estilos principales
│   ├── dashboard.css      # Estilos del dashboard
│   └── albums.css         # Estilos de páginas de álbumes
│
├── js/
│   ├── app.js             # Lógica principal
│   ├── dashboard.js       # Gráficos y estadísticas
│   ├── albums.js          # Funcionalidades de álbumes
│   └── youtube.js         # Integración YouTube API
│
├── pages/
│   ├── noeasy.html        # Álbum NOEASY
│   ├── oddinary.html      # Álbum ODDINARY
│   ├── rockstar.html      # Álbum ROCK-STAR
│   ├── ate.html           # Álbum ATE
│   └── maxident.html      # Álbum MAXIDENT
│
├── assets/
│   ├── images/            # Imágenes del proyecto
│   └── videos/            # Archivos de video
│
├── data/
│   └── albums.json        # Datos de álbumes y miembros
│
└── README.md              # Este archivo
```

## 🚀 Inicio Rápido

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/SKZ-WEB.git
cd SKZ-WEB
```

### 2. Instalar Dependencias
No requiere dependencias. Solo necesitas un servidor web local.

### 3. Iniciar Servidor Local
```bash
# Con Python 3
python -m http.server 8000

# Con Python 2
python -m SimpleHTTPServer 8000

# Con Node.js (http-server)
npx http-server
```

### 4. Acceder a la Página
Abre tu navegador en `http://localhost:8000`

## 🔧 Configuración

### YouTube API

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto
3. Activar **YouTube Data API v3**
4. Generar una **API Key**
5. Copiar `js/config.example.js` como `js/config.js`
6. En `js/config.js`, reemplazar:
```javascript
window.SKZ_CONFIG = {
    youtubeApiKey: 'YOUR_YOUTUBE_API_KEY'
};
```
Con tu clave real.

`js/config.js` esta ignorado por Git para evitar subir claves privadas al repositorio.

### Videos en paginas de album

Cada pagina dentro de `pages/` tiene una seccion lista para mostrar un video antes de la lista de canciones:

```html
<section class="album-video-section" data-youtube-url="">
```

Pega ahi el link completo de YouTube:

```html
<section class="album-video-section" data-youtube-url="https://www.youtube.com/watch?v=VIDEO_ID">
```

Tambien acepta links cortos como `https://youtu.be/VIDEO_ID`, links `/embed/VIDEO_ID` o directamente el ID del video.

## 🎨 Paleta de Colores

| Color | Uso | Código |
|-------|-----|--------|
| Rojo | Principal, Highlights | `#FF0000` |
| Negro | Fondo | `#000000` |
| Blanco | Texto | `#FFFFFF` |
| Oro | NOEASY | `#FFD700` |
| Púrpura | ODDINARY | `#9D4EDD` |
| Rosa | MAXIDENT | `#FF69B4` |

## 📚 Librerías Utilizadas

- **Chart.js** - Gráficos interactivos
  ```html
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  ```

- **Font Awesome** - Iconos
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  ```

## 🌐 Páginas Principales

### 1. **index.html** - Página Principal
- Hero section
- Grid de álbumes
- Álbum destacado (MAXIDENT)
- Estadísticas por números
- Perfiles de miembros
- Footer con enlaces

### 2. **dashboard.html** - Panel de Control
- Estadísticas generales
- 4 Gráficos interactivos con Chart.js
- Timeline histórico del grupo
- Estadísticas por miembro
- Actividad reciente

### 3. **pages/\*.html** - Páginas de Álbumes
- Información del álbum
- Lista completa de canciones
- Reseñas de fans
- Enlaces a otros álbumes

## 🔍 Gráficos del Dashboard

1. **Lanzamientos por Año** - Gráfico de barras
2. **Distribución de Géneros** - Gráfico de dona
3. **Popularidad de Álbumes** - Gráfico radar
4. **Estadísticas Mensuales** - Gráfico de línea

## 📱 Responsive Design

La web es completamente responsiva con breakpoints en:
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: 480px - 767px
- Small Mobile: < 480px

## ✨ Características JavaScript

- Menú hamburguesa responsivo
- Scroll suave
- Animaciones al cargar
- Efectos hover interactivos
- Carga dinámica de datos
- Integración con YouTube API

## 🎯 Próximas Mejoras

- [ ] Agregar más álbumes
- [ ] Implementar galería de imágenes
- [ ] Agregar sección de noticias
- [ ] Sistema de comentarios
- [ ] Dark mode toggle
- [ ] Multi-idioma

## 📝 Licencia

Este proyecto es una fanpage no oficial. Todos los derechos sobre Stray Kids pertenecen a **JYP Entertainment**.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes, por favor abre un issue primero.

## 📧 Contacto

Para reportar bugs o sugerir mejoras, abre un issue en GitHub.

---

**Hecho con ❤️ por STAYs**

*"S-Class, 특별하고 특별한 Stray Kids"*
