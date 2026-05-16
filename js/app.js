// App.js - Controlador principal
const API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Reemplazar con tu clave de API

// Datos de álbumes
const albums = [
    {
        id: 1,
        title: 'NOEASY',
        date: '2021-08-13',
        color: '#FFD700',
        description: 'Debut del grupo con conceptos innovadores',
        link: 'pages/noeasy.html'
    },
    {
        id: 2,
        title: 'ODDINARY',
        date: '2022-03-18',
        color: '#9D4EDD',
        description: 'Segundo álbum con propuesta artística única',
        link: 'pages/oddinary.html'
    },
    {
        id: 3,
        title: 'ROCK-STAR',
        date: '2022-06-18',
        color: '#FF0000',
        description: 'Tercer mini álbum con energía rock',
        link: 'pages/rockstar.html'
    },
    {
        id: 4,
        title: 'ATE',
        date: '2022-09-23',
        color: '#0077B6',
        description: 'Cuarto mini álbum de madurez artística',
        link: 'pages/ate.html'
    },
    {
        id: 5,
        title: 'MAXIDENT',
        date: '2022-11-04',
        color: '#FF69B4',
        description: 'Quinto mini álbum con identidad visual nueva',
        link: 'pages/maxident.html'
    }
];

// Inicializar cuando el DOM carga
document.addEventListener('DOMContentLoaded', () => {
    loadAlbums();
    setupNavigation();
});

// Cargar álbumes en la grid
function loadAlbums() {
    const albumsGrid = document.getElementById('albumsGrid');
    if (!albumsGrid) return;

    albumsGrid.innerHTML = albums.map(album => `
        <div class="album-card">
            <div class="album-image" style="background: linear-gradient(135deg, ${album.color}, #000);">
                ${album.title}
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
        });

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
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

// Exportar para uso en otros archivos
window.strayKidsApp = {
    albums,
    fetchYouTubeVideos,
    smoothScroll
};
