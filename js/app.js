// App.js - Controlador principal
const API_KEY = window.SKZ_CONFIG?.youtubeApiKey || 'YOUR_YOUTUBE_API_KEY';

// Datos de álbumes
const albums = [
    {
        id: 1,
        title: "MIXTAPE",
        date: "2018-01-08",
        color: "#3a3a3a",
        description: "Mixtape es el EP pre-debut de Stray Kids, conteniendo las 7 canciones autocompuestas que los miembros interpretaron durante el reality show de Mnet. Incluye \"Hellevator\" como tema principal y marca el inicio de la identidad musical del grupo.",
        link: "pages/mixtape.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778915679/mixtape_wqc9e3.avif"
    },
    {
        id: 2,
        title: "I am NOT",
        date: "2018-03-26",
        color: "#cc2200",
        description: "Primer mini álbum oficial y debut de Stray Kids. Con \"District 9\" como tema principal, inicia la trilogía \"I Am\" sobre identidad y autodescubrimiento. Todas las canciones fueron co-escritas por los miembros, estableciendo su filosofía de autoproducción.",
        link: "pages/iamnot.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778915816/inot_kupwtq.jpg"
    },
    {
        id: 3,
        title: "I am WHO",
        date: "2018-08-06",
        color: "#1a3a6b",
        description: "Segundo capítulo de la trilogía \"I Am\". Con \"My Pace\" como tema principal, el álbum explora la presión social y la importancia de seguir tu propio ritmo. Primer comeback del grupo a solo 5 meses de su debut.",
        link: "pages/iamwho.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778916108/who_rwdthb.jpg"
    },
    {
        id: 4,
        title: "I am YOU",
        date: "2018-10-22",
        color: "#2d6a4f",
        description: "Cierre de la trilogía \"I Am\". Con el tema homónimo \"I am YOU\" como sencillo principal, explora la relación entre encontrarse a uno mismo a través de los demás. Incluye géneros variados desde pop-rock hasta drum and bass.",
        link: "pages/iamyou.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778916295/you_h6sdvd.jpg"
    },
    {
        id: 5,
        title: "Clé 1: MIROH",
        date: "2019-03-25",
        color: "#b8860b",
        description: "Inicio de la trilogía \"Clé\", lanzado en el primer aniversario del debut. \"MIROH\" (palabra inventada por el grupo que combina \"miro\"/laberinto con H de heaven/hell) les dio su primera victoria en un programa musical en M Countdown.",
        link: "pages/cle1miroh.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778916447/miroh_iva5vw.jpg"
    },
    {
        id: 6,
        title: "Clé 2: Yellow Wood",
        date: "2019-06-19",
        color: "#c9a800",
        description: "Segundo capítulo de la serie \"Clé\" con \"Side Effects\" como tema principal. Lanzado entre las etapas americana y europea de su primera gira mundial. Incluye los Mixtapes #1-#4 previamente solo disponibles en formato físico.",
        link: "pages/cle2yellowwood.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778916622/yellow_sngclw.jpg"
    },
    {
        id: 7,
        title: "Clé: LEVANTER",
        date: "2019-12-09",
        color: "#5ba4cf",
        description: "Cierre de la trilogía \"Clé\". \"Levanter\" hace referencia a un viento fuerte del Mediterráneo, simbolizando el camino libre de Stray Kids. Fue retrasado debido a la salida de Woojin del grupo en octubre de 2019.",
        link: "pages/clelevanter.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778916725/leventer_ysaiib.jpg"
    },
    {
        id: 8,
        title: "GO LIVE (GO生)",
        date: "2020-06-17",
        color: "#e06000",
        description: "Primer álbum de estudio completo de Stray Kids. \"God's Menu\" se convirtió en una de sus canciones más icónicas y su primer sencillo certificado Gold por la RIAA. Primer álbum del grupo en obtener certificación Platino por KMCA.",
        link: "pages/golive.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778917002/go_jhkvxk.jpg"
    },
    {
        id: 9,
        title: "IN LIFE (IN生)",
        date: "2020-09-14",
        color: "#b34700",
        description: "Versión repackage de GO LIVE con \"Back Door\" como nuevo sencillo principal. Incluye las 14 pistas originales más 3 canciones nuevas. Consolidó el éxito comercial del grupo alcanzando certificación Triple Platino.",
        link: "pages/inlife.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778917111/life_fqqjox.jpg"
    },
    {
        id: 10,
        title: "NOEASY",
        date: "2021-08-23",
        color: "#0055ff",
        description: "Segundo álbum de estudio y primer millón-seller de Stray Kids y de JYP Entertainment. Con \"Thunderous\" como tema principal, obtuvo 6 victorias en programas musicales. Su concepto gira en torno a cazadores de monstruos que luchan con el ruido.",
        link: "pages/noeasy.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1779002861/nnnn_vwxsye.jpg"
    },
    {
        id: 11,
        title: "ODDINARY",
        date: "2022-03-18",
        color: "#6b2fa0",
        description: "Con \"MANIAC\" como sencillo principal, debutó en el #1 del Billboard 200, haciendo a Stray Kids el tercer artista coreano en lograr esto. Celebra al inconformista cotidiano con una producción que va del techno-trap industrial al emo-trap.",
        link: "pages/oddinary.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778909625/oddinay_iy5lqm.jpg"
    },
    {
        id: 12,
        title: "MAXIDENT",
        date: "2022-10-07",
        color: "#d63384",
        description: "Con \"CASE 143\" como tema principal, fue el segundo #1 consecutivo en Billboard 200. Se convirtió en el primer álbum de Stray Kids y JYP en superar los 2 y 3 millones de copias vendidas, certificado Triple Millón por KMCA.",
        link: "pages/maxident.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778909954/maxi_ha5ez2.jpg"
    },
    {
        id: 13,
        title: "5-STAR (★★★★★)",
        date: "2023-06-02",
        color: "#8b0000",
        description: "Tercer álbum de estudio con \"S-Class\" como sencillo principal. Rompió récords con más de 5.13 millones de pre-órdenes, siendo el primer álbum en la historia del K-pop en lograrlo. #1 en Billboard 200 y certificado Gold por la RIAA.",
        link: "pages/5star.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778917454/five_eqxjkd.jpg"
    },
    {
        id: 14,
        title: "ROCK-STAR",
        date: "2023-11-10",
        color: "#1a1a1a",
        description: "Con \"LALALALA\" como tema principal, este EP marcó la primera entrada de Stray Kids en el Billboard Hot 100 (posición #90). Incluye la colaboración con la cantante japonesa LiSA en \"Social Path\".",
        link: "pages/rockstar.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778909892/rock_wae5u4.jpg"
    },
    {
        id: 15,
        title: "ATE",
        date: "2024-07-19",
        color: "#00875a",
        description: "Noveno mini álbum con \"Chk Chk Boom\" como sencillo principal de estilo latin-pop/hip-hop. El título hace referencia al slang de TikTok derivado de \"dominate\". Sirvió como base para la gira mundial dominATE.",
        link: "pages/ate.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778909914/ate_hkjrup.jpg"
    },
    {
        id: 16,
        title: "HOP",
        date: "2024-12-13",
        color: "#20b2aa",
        description: "Primer mixtape oficial del grupo con \"Walkin on Water\" como sencillo principal. Destaca por incluir canciones solistas de cada miembro, originalmente interpretadas en la gira dominATE. Colaboración con Tablo de Epik High en \"U\".",
        link: "pages/hop.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778917716/hop_myjcok.jpg"
    },
    {
        id: 17,
        title: "KARMA",
        date: "2025-08-22",
        color: "#708090",
        description: "Cuarto álbum de estudio con \"CEREMONY\" como tema principal, fusionando funk brasileño con EDM trap. Lanzado tras la conclusión de la gira dominATE. Ganó Daesang (Gran Premio) de Álbum del Año en MAMA 2025, AAA, Golden Disc y más. #1 en Billboard 200.",
        link: "pages/karma.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778917941/karma_ip1osm.jpg"
    },
    {
        id: 18,
        title: "DO IT",
        date: "2025-11-21",
        color: "#ff6347",
        description: "Segundo mixtape y primero de la serie \"SKZ IT TAPE\". Con los sencillos dobles \"Do It\" (hip-hop con influencias de reggaetón) y \"DIVINE\" (hip-hop old-school). Un proyecto íntimo que captura al grupo en un momento específico de su carrera, siete años después de su debut.",
        link: "pages/doit.html",
        imageUrl: "https://res.cloudinary.com/dhbsp8htx/image/upload/v1778918037/doit_iowcsh.jpg"
    }
];

// Inicializar cuando el DOM carga
document.addEventListener('DOMContentLoaded', () => {
    loadAlbums();
    setupNavigation();
    setupHeroEffects();
});

// Cargar álbumes en la grid
function loadAlbums() {
    const albumsGrid = document.getElementById('albumsGrid');
    if (!albumsGrid) return;

    const isFeatured = albumsGrid.getAttribute('data-featured') === 'true';
    const featuredTitles = ['5-STAR (★★★★★)', 'KARMA', 'ODDINARY', 'NOEASY'];
    const albumsToDisplay = isFeatured ? albums.filter(a => featuredTitles.includes(a.title)) : albums;

    albumsGrid.innerHTML = albumsToDisplay.map(album => `
        <div class="album-card">
            <div class="album-image" style="${album.imageUrl ? `background-image: url('${album.imageUrl}'); background-size: cover; background-position: center;` : `background: linear-gradient(135deg, ${album.color}, #000);`}">
                ${album.imageUrl ? '' : album.title}
            </div>
            <div class="album-info">
                <h3 class="album-title">${album.title}</h3>
                <p class="album-date">${formatDate(album.date)}</p>
                <p class="album-description">${album.description}</p>
                <a href="${album.link}" class="btn-secondary">Ver Detalles</a>
            </div>
        </div>
    `).join('');
}

// Formato de fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Setup del menú de navegación
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Actualizar link activo según la página actual
        updateActiveLink();
    }
}

// Actualizar link activo del navbar
function updateActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Función para obtener videos de YouTube (opcional)
async function fetchYouTubeVideos(query) {
    if (API_KEY === 'YOUR_YOUTUBE_API_KEY') {
        console.warn('Por favor configurar la API key de YouTube');
        return [];
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}

// Scroll suave mejorado
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Configurar efectos de zoom y variables de CSS para el banner principal (Hero)
function setupHeroEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Obtener la imagen de fondo inline y la posición
    const bgImage = hero.style.backgroundImage;
    const bgPosition = hero.style.backgroundPosition || 'center center';

    if (bgImage) {
        // Extraer únicamente la URL de la imagen, eliminando el degradado oscuro inline del HTML
        const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/i);
        const imageUrl = urlMatch ? urlMatch[0] : bgImage;

        // Guardar en variables de CSS para que las use el pseudo-elemento ::before
        hero.style.setProperty('--hero-bg-url', imageUrl);
        hero.style.setProperty('--hero-bg-pos', bgPosition);
        // Limpiar la imagen del contenedor principal para evitar duplicación
        hero.style.backgroundImage = 'none';
    }
}

// Exportar para uso en otros archivos
window.strayKidsApp = {
    albums,
    fetchYouTubeVideos,
    smoothScroll,
    setupHeroEffects
};

// Cargar dinámicamente el reproductor de audio flotante y su cola de reproducción
(function() {
    const isSubPage = window.location.pathname.includes('/pages/');
    const basePath = isSubPage ? '../' : '';
    
    // Evitar duplicaciones
    if (window.skzPlayerBarLoaded) return;
    window.skzPlayerBarLoaded = true;

    // Inyectar CSS de la barra
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${basePath}css/player-bar.css`;
    document.head.appendChild(link);

    // Cargar script de la barra
    const script = document.createElement('script');
    script.src = `${basePath}js/player-bar.js`;
    script.defer = true;
    document.body.appendChild(script);
})();
