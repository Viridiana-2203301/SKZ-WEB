// albums.js - Lógica para páginas de álbumes

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupAlbumVideos();
    enhanceTrackList();
    setupAlbumHeroEffects();
});

// Setup de navegación
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Preparar videos de YouTube para cada album
function setupAlbumVideos() {
    const videoBlocks = document.querySelectorAll('[data-youtube-url]');

    videoBlocks.forEach(block => {
        const url = block.dataset.youtubeUrl.trim();
        const player = block.querySelector('.album-video-player');
        const copy = block.querySelector('.album-video-copy');

        if (!url || !player) {
            return;
        }

        const videoId = getYouTubeVideoId(url);

        if (!videoId) {
            player.classList.add('has-video-error');
            return;
        }

        const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const embedParams = new URLSearchParams({
            rel: '0',
            modestbranding: '1',
            playsinline: '1'
        });

        if (window.location.origin.startsWith('http')) {
            embedParams.set('origin', window.location.origin);
        }

        player.innerHTML = `
            <iframe
                src="https://www.youtube.com/embed/${videoId}?${embedParams.toString()}"
                title="Video de YouTube del album"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen>
            </iframe>
        `;

        if (copy && !copy.querySelector('.album-video-link')) {
            copy.insertAdjacentHTML('beforeend', `
                <a class="album-video-link" href="${watchUrl}" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-youtube"></i>
                    Ver en YouTube
                </a>
            `);
        }
    });
}

function getYouTubeVideoId(url) {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname.includes('youtu.be')) {
            return cleanYouTubeVideoId(parsedUrl.pathname.split('/').filter(Boolean)[0] || '');
        }

        if (parsedUrl.searchParams.has('v')) {
            return cleanYouTubeVideoId(parsedUrl.searchParams.get('v'));
        }

        const embedMatch = parsedUrl.pathname.match(/\/(?:embed|shorts)\/([^/?&#]+)/);
        return embedMatch ? cleanYouTubeVideoId(embedMatch[1]) : '';
    } catch (error) {
        return cleanYouTubeVideoId(url);
    }
}

function cleanYouTubeVideoId(videoId) {
    const cleanedId = videoId.split(/[?&#]/)[0].trim();
    return /^[a-zA-Z0-9_-]{11}$/.test(cleanedId) ? cleanedId : '';
}

// Mejorar lista de canciones
function enhanceTrackList() {
    const tracks = document.querySelectorAll('.track-item');
    tracks.forEach((track, index) => {
        track.style.animationDelay = `${index * 0.1}s`;
        track.style.animation = 'fadeInUp 0.6s ease forwards';

        track.addEventListener('mouseover', function() {
            this.style.transform = 'translateX(10px)';
        });

        track.addEventListener('mouseout', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Animar elementos de reseña
function animateReviews() {
    const reviews = document.querySelectorAll('.review-card');
    reviews.forEach((review, index) => {
        review.style.animationDelay = `${index * 0.15}s`;
        review.style.animation = 'fadeInUp 0.8s ease forwards';
    });
}

// Hacer que las tarjetas de álbumes relacionados sean interactivas
function setupRelatedAlbums() {
    const albumCards = document.querySelectorAll('.album-link-card');
    albumCards.forEach(card => {
        card.addEventListener('click', function() {
            const link = this.querySelector('.album-link-title');
            if (link) {
                window.location.href = link.href;
            }
        });

        card.style.cursor = 'pointer';
    });
}

// Configurar efectos de zoom y variables de CSS para el banner (Hero)
function setupAlbumHeroEffects() {
    const hero = document.querySelector('.album-hero');
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

// Ejecutar cuando el DOM esté listo
window.addEventListener('load', () => {
    animateReviews();
    setupRelatedAlbums();
});

// Exportar para uso global
window.albumsApp = {
    setupAlbumVideos,
    enhanceTrackList,
    animateReviews,
    setupRelatedAlbums,
    setupAlbumHeroEffects
};
