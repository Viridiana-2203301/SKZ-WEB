// albums.js - Lógica para páginas de álbumes

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupAlbumVideos();
    setupTrackThumbnails();
    setupTrackAudioPlayers();
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

// Crear miniaturas de YouTube en canciones con data-youtube-url
function setupTrackThumbnails() {
    const tracks = document.querySelectorAll('.track-item[data-youtube-url]');

    tracks.forEach(track => {
        const videoId = getYouTubeVideoId(track.dataset.youtubeUrl.trim());

        if (!videoId || track.querySelector('.track-thumbnail')) {
            return;
        }

        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const trackInfo = track.querySelector('.track-info');

        const thumbnail = document.createElement('button');
        thumbnail.type = 'button';
        thumbnail.className = 'track-thumbnail';
        thumbnail.setAttribute('aria-label', 'Reproducir cancion');
        thumbnail.innerHTML = `
            <img src="${thumbnailUrl}" alt="" loading="lazy">
            <span class="track-thumbnail-play">
                <i class="fas fa-play"></i>
            </span>
        `;
        thumbnail.addEventListener('click', () => {
            playTrackVideo(thumbnail, videoId);
        });

        if (trackInfo) {
            trackInfo.insertAdjacentElement('beforebegin', thumbnail);
        } else {
            track.appendChild(thumbnail);
        }
    });
}

function playTrackVideo(thumbnail, videoId) {
    const embedParams = new URLSearchParams({
        autoplay: '1',
        rel: '0',
        modestbranding: '1',
        playsinline: '1'
    });

    if (window.location.origin.startsWith('http')) {
        embedParams.set('origin', window.location.origin);
    }

    thumbnail.classList.add('is-playing');
    thumbnail.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}?${embedParams.toString()}"
            title="Reproductor de YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
        </iframe>
    `;
}

// Crear reproductores de audio en canciones con data-audio-url
function setupTrackAudioPlayers() {
    const tracks = document.querySelectorAll('.track-item[data-audio-url]');

    tracks.forEach(track => {
        const audioUrl = track.dataset.audioUrl.trim();

        if (!audioUrl || track.querySelector('.track-audio-player')) {
            return;
        }

        const player = document.createElement('div');
        player.className = 'track-audio-player';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'track-audio-button';
        button.setAttribute('aria-label', 'Reproducir audio');
        button.innerHTML = '<i class="fas fa-play"></i>';

        const progress = document.createElement('input');
        progress.className = 'track-audio-progress';
        progress.type = 'range';
        progress.min = '0';
        progress.max = '100';
        progress.value = '0';
        progress.step = '0.1';
        progress.setAttribute('aria-label', 'Progreso del audio');

        const time = document.createElement('span');
        time.className = 'track-audio-time';
        time.textContent = '0:00';

        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        audio.src = audioUrl;

        const meta = document.createElement('div');
        meta.className = 'track-audio-meta';
        meta.append(progress, time);

        player.append(button, meta, audio);

        const trackInfo = track.querySelector('.track-info');
        if (trackInfo) {
            trackInfo.insertAdjacentElement('afterend', player);
        } else {
            track.appendChild(player);
        }

        button.addEventListener('click', () => toggleTrackAudio(audio, button));
        audio.addEventListener('loadedmetadata', () => {
            time.textContent = formatAudioTime(audio.duration);
        });
        audio.addEventListener('timeupdate', () => {
            if (!Number.isFinite(audio.duration) || audio.duration === 0) {
                return;
            }

            progress.value = String((audio.currentTime / audio.duration) * 100);
            time.textContent = formatAudioTime(audio.currentTime);
        });
        audio.addEventListener('ended', () => {
            button.innerHTML = '<i class="fas fa-play"></i>';
            button.setAttribute('aria-label', 'Reproducir audio');
            progress.value = '0';
            time.textContent = formatAudioTime(audio.duration);
        });
        progress.addEventListener('input', () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                audio.currentTime = (Number(progress.value) / 100) * audio.duration;
            }
        });
    });
}

function toggleTrackAudio(audio, button) {
    const isPlaying = !audio.paused;

    document.querySelectorAll('.track-audio-player audio').forEach(otherAudio => {
        if (otherAudio !== audio) {
            otherAudio.pause();
            updateAudioButton(otherAudio, false);
        }
    });

    if (isPlaying) {
        audio.pause();
        updateAudioButton(audio, false);
        return;
    }

    audio.play()
        .then(() => {
            updateAudioButton(audio, true);
        })
        .catch(() => {
            updateAudioButton(audio, false);
        });
}

function updateAudioButton(audio, isPlaying) {
    const player = audio.closest('.track-audio-player');
    const button = player?.querySelector('.track-audio-button');

    if (!button) {
        return;
    }

    button.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    button.setAttribute('aria-label', isPlaying ? 'Pausar audio' : 'Reproducir audio');
    player.classList.toggle('is-playing', isPlaying);
}

function formatAudioTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
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
    setupAlbumVideos,
    setupTrackThumbnails,
    setupTrackAudioPlayers,
    enhanceTrackList,
    animateReviews,
    setupRelatedAlbums
};
