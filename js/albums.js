// albums.js - Lógica para páginas de álbumes

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    enhanceTrackList();
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

// Ejecutar cuando el DOM esté listo
window.addEventListener('load', () => {
    animateReviews();
    setupRelatedAlbums();
});

// Exportar para uso global
window.albumsApp = {
    enhanceTrackList,
    animateReviews,
    setupRelatedAlbums
};
