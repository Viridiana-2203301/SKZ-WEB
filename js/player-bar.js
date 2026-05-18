/* ==========================================================================
   LÓGICA DEL REPRODUCTOR FLOTANTE PERSISTENTE Y COLA DE REPRODUCCIÓN (SKZ-WEB)
   ========================================================================== */

(function() {
    if (window.skzPlayerBarInitialized) return;
    window.skzPlayerBarInitialized = true;

    // --- VARIABLES DE ESTADO ---
    let queue = [];
    let currentIndex = -1;
    let activeAudio = null;
    let globalAudio = null;
    let isPlayingFromQueue = false;
    let saveTimeout = null;

    // --- REFERENCIAS DEL DOM ---
    let playerBar = null;
    let queueDrawer = null;
    let toastNode = null;

    // --- INICIALIZACIÓN ---
    document.addEventListener('DOMContentLoaded', () => { initPlayer(); });
    if (document.readyState === 'interactive' || document.readyState === 'complete') { initPlayer(); }

    function initPlayer() {
        if (document.getElementById('skz-player-bar-container')) return;
        createDOMNodes();
        initGlobalAudio();
        loadStateFromLocalStorage();
        initQueueButtons();
        setupEventListeners();
        setTimeout(initQueueButtons, 600);
        setTimeout(initQueueButtons, 1600);
    }

    // --- CREAR HTML DEL REPRODUCTOR ---
    function createDOMNodes() {
        const container = document.createElement('div');
        container.id = 'skz-player-bar-container';

        container.innerHTML = `
            <div class="skz-player-bar" id="skzPlayerBar">
                <div class="player-bar-left">
                    <div class="player-bar-cover-wrapper">
                        <div class="player-bar-cover" id="playerCover"></div>
                    </div>
                    <div class="player-bar-details">
                        <span class="player-bar-title" id="playerTitle">Ninguna canción</span>
                        <span class="player-bar-artist-album" id="playerArtistAlbum">Stray Kids</span>
                    </div>
                </div>
                <div class="player-bar-middle">
                    <div class="player-controls">
                        <button class="control-btn" id="btnPrev" title="Anterior"><i class="fas fa-step-backward"></i></button>
                        <button class="control-btn play-pause-btn" id="btnPlayPause" title="Reproducir/Pausar"><i class="fas fa-play"></i></button>
                        <button class="control-btn" id="btnNext" title="Siguiente"><i class="fas fa-step-forward"></i></button>
                    </div>
                    <div class="player-progress-container">
                        <span id="timeCurrent">0:00</span>
                        <input type="range" class="player-progress" id="progressSlider" min="0" max="100" value="0">
                        <span id="timeTotal">0:00</span>
                    </div>
                </div>
                <div class="player-bar-right">
                    <div class="volume-container">
                        <button class="volume-btn" id="btnMute" title="Silenciar"><i class="fas fa-volume-up"></i></button>
                        <input type="range" class="volume-slider" id="volumeSlider" min="0" max="1" step="0.05" value="0.8">
                    </div>
                    <div class="queue-btn-wrapper">
                        <button class="control-btn queue-btn" id="btnToggleQueue" title="Cola de reproducción"><i class="fas fa-list-ul"></i></button>
                        <span class="queue-badge" id="queueBadge">0</span>
                    </div>
                </div>
            </div>

            <div class="skz-queue-drawer" id="queueDrawer">
                <div class="drawer-header">
                    <span class="drawer-title"><i class="fas fa-music"></i> Cola de reproducción</span>
                    <button class="clear-queue-btn" id="btnClearQueue">Limpiar cola</button>
                </div>
                <div class="drawer-content">
                    <span class="queue-section-title">Sonando ahora</span>
                    <div id="queueCurrentSection"><div class="empty-queue-msg">Ninguna canción en reproducción</div></div>
                    <span class="queue-section-title" style="margin-top:1.5rem;">Siguientes en la cola</span>
                    <div class="queue-track-list" id="queueList">
                        <div class="empty-queue-msg">La cola está vacía. Añade temas con el botón +.</div>
                    </div>
                </div>
            </div>

            <div class="skz-player-toast" id="playerToast">
                <i class="fas fa-check-circle"></i>
                <span class="toast-message" id="toastMsg">Agregado a la cola</span>
            </div>
        `;

        document.body.appendChild(container);
        playerBar  = document.getElementById('skzPlayerBar');
        queueDrawer = document.getElementById('queueDrawer');
        toastNode  = document.getElementById('playerToast');
    }

    // --- AUDIO GLOBAL (persiste entre páginas via localStorage) ---
    function initGlobalAudio() {
        globalAudio = document.createElement('audio');
        globalAudio.id = 'skz-global-audio';
        globalAudio.preload = 'metadata';
        document.body.appendChild(globalAudio);
    }

    // --- BOTONES "+" EN CADA PISTA ---
    function initQueueButtons() {
        document.querySelectorAll('.track-item').forEach(track => {
            const player = track.querySelector('.track-audio-player');
            if (player && !track.querySelector('.track-add-to-queue-btn')) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'track-add-to-queue-btn';
                btn.innerHTML = '<i class="fas fa-plus"></i>';
                btn.title = 'Agregar a la cola';
                btn.addEventListener('click', (e) => { e.stopPropagation(); addTrackToQueue(track); });
                player.appendChild(btn);
            }
        });
    }

    // --- AGREGAR PISTA A LA COLA ---
    function addTrackToQueue(trackEl) {
        const audioUrl = trackEl.dataset.audioUrl?.trim();
        if (!audioUrl) return;

        const title = trackEl.querySelector('.track-info h4')?.textContent?.trim() || 'Canción';

        const coverDiv = document.querySelector('.cover-image');
        let coverUrl = '';
        if (coverDiv) {
            const m = coverDiv.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/i);
            if (m) coverUrl = m[1];
        }

        const albumEl = document.querySelector('.album-details h2') || document.querySelector('.album-hero-content h1');
        const albumTitle = albumEl ? albumEl.textContent.trim() : 'Stray Kids';

        queue.push({ title, audioUrl, albumTitle, coverUrl });
        updateQueueUI();
        showToast(`Agregado a la cola: ${title}`);
        saveStateToLocalStorage();
    }

    // --- TOAST ---
    function showToast(msg) {
        document.getElementById('toastMsg').textContent = msg;
        toastNode.classList.add('active');
        setTimeout(() => toastNode.classList.remove('active'), 3000);
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Capturar eventos de audio en fase capture (todos los <audio> de la página)
        document.addEventListener('play',       (e) => { if (e.target.tagName === 'AUDIO') handleAudioPlay(e.target); }, true);
        document.addEventListener('pause',      (e) => { if (e.target.tagName === 'AUDIO') handleAudioPause(e.target); }, true);
        document.addEventListener('timeupdate', (e) => { if (e.target.tagName === 'AUDIO') handleAudioTimeUpdate(e.target); }, true);
        document.addEventListener('ended',      (e) => { if (e.target.tagName === 'AUDIO') handleAudioEnded(e.target); }, true);

        document.getElementById('btnPlayPause').addEventListener('click', togglePlayPause);
        document.getElementById('btnNext').addEventListener('click', playNext);
        document.getElementById('btnPrev').addEventListener('click', playPrev);

        const progressSlider = document.getElementById('progressSlider');
        progressSlider.addEventListener('input', () => {
            if (activeAudio) {
                document.getElementById('timeCurrent').textContent = formatTime((progressSlider.value / 100) * activeAudio.duration);
            }
        });
        progressSlider.addEventListener('change', () => {
            if (activeAudio && Number.isFinite(activeAudio.duration)) {
                activeAudio.currentTime = (progressSlider.value / 100) * activeAudio.duration;
                saveStateToLocalStorage();
            }
        });

        const volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.addEventListener('input', () => setGlobalVolume(volumeSlider.value));
        document.getElementById('btnMute').addEventListener('click', toggleMute);

        document.getElementById('btnToggleQueue').addEventListener('click', toggleQueueDrawer);
        document.getElementById('btnClearQueue').addEventListener('click', clearQueue);

        document.addEventListener('click', (e) => {
            if (queueDrawer.classList.contains('active') &&
                !queueDrawer.contains(e.target) &&
                !playerBar.contains(e.target)) {
                queueDrawer.classList.remove('active');
            }
        });
    }

    // --- MANEJADORES DE AUDIO ---
    function handleAudioPlay(audioEl) {
        // Si arranca un audio diferente al activo, pausar el anterior
        if (activeAudio && activeAudio !== audioEl) {
            activeAudio.pause();
        }
        activeAudio = audioEl;
        isPlayingFromQueue = (audioEl === globalAudio);

        if (!isPlayingFromQueue && globalAudio) globalAudio.pause();

        playerBar.classList.add('active', 'is-playing');
        document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-pause"></i>';

        syncTrackMetadata(audioEl);
        saveStateToLocalStorage();
        updateQueueUI();
    }

    function handleAudioPause(audioEl) {
        if (activeAudio !== audioEl) return;
        playerBar.classList.remove('is-playing');
        document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-play"></i>';
        saveStateToLocalStorage();
    }

    function handleAudioTimeUpdate(audioEl) {
        if (activeAudio !== audioEl) return;
        const slider = document.getElementById('progressSlider');
        if (Number.isFinite(audioEl.duration) && audioEl.duration > 0) {
            slider.value = (audioEl.currentTime / audioEl.duration) * 100;
            document.getElementById('timeCurrent').textContent = formatTime(audioEl.currentTime);
            document.getElementById('timeTotal').textContent = formatTime(audioEl.duration);
        }
        throttleSaveState();
    }

    function handleAudioEnded(audioEl) {
        if (activeAudio !== audioEl) return;
        playerBar.classList.remove('is-playing');
        document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-play"></i>';

        if (queue.length > 0 && currentIndex + 1 < queue.length) {
            playNext();
        } else if (!isPlayingFromQueue) {
            playNextAlbumTrack();
        }
    }

    // --- SINCRONIZAR METADATOS ---
    function syncTrackMetadata(audioEl) {
        const coverEl       = document.getElementById('playerCover');
        const titleEl       = document.getElementById('playerTitle');
        const artistAlbumEl = document.getElementById('playerArtistAlbum');

        if (isPlayingFromQueue && queue[currentIndex]) {
            const t = queue[currentIndex];
            titleEl.textContent = t.title;
            artistAlbumEl.textContent = `Stray Kids • ${t.albumTitle}`;
            coverEl.style.backgroundImage = t.coverUrl ? `url('${t.coverUrl}')` : '';
            return;
        }

        const trackItem = audioEl.closest?.('.track-item');
        if (trackItem) {
            titleEl.textContent = trackItem.querySelector('.track-info h4')?.textContent?.trim() || 'Canción';

            const coverDiv = document.querySelector('.cover-image');
            let coverUrl = '';
            if (coverDiv) {
                const m = coverDiv.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/i);
                if (m) coverUrl = m[1];
            }
            const albumEl = document.querySelector('.album-details h2') || document.querySelector('.album-hero-content h1');
            artistAlbumEl.textContent = `Stray Kids • ${albumEl ? albumEl.textContent.trim() : 'Album'}`;
            coverEl.style.backgroundImage = coverUrl ? `url('${coverUrl}')` : '';
        }
    }

    // --- CONTROLES ---
    function togglePlayPause() {
        if (!activeAudio) {
            if (queue.length > 0) { currentIndex = 0; playQueueTrack(0); }
            else {
                const btn = document.querySelector('.track-audio-button');
                if (btn) btn.click();
            }
            return;
        }
        if (activeAudio.paused) activeAudio.play().catch(() => {});
        else activeAudio.pause();
    }

    function playQueueTrack(index) {
        if (index < 0 || index >= queue.length) return;
        currentIndex = index;
        isPlayingFromQueue = true;

        const track = queue[currentIndex];
        document.getElementById('playerTitle').textContent = track.title;
        document.getElementById('playerArtistAlbum').textContent = `Stray Kids • ${track.albumTitle}`;
        document.getElementById('playerCover').style.backgroundImage = track.coverUrl ? `url('${track.coverUrl}')` : '';

        const volSlider = document.getElementById('volumeSlider');
        globalAudio.volume = volSlider ? Number(volSlider.value) : 0.8;
        globalAudio.src = track.audioUrl;

        const startOnce = () => {
            globalAudio.removeEventListener('canplay', startOnce);
            globalAudio.play().catch(() => {
                document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-play"></i>';
            });
        };
        globalAudio.addEventListener('canplay', startOnce);
        globalAudio.load();

        activeAudio = globalAudio;
        playerBar.classList.add('active');
        updateQueueUI();
        saveStateToLocalStorage();
    }

    function playNext() {
        if (queue.length > 0 && currentIndex + 1 < queue.length) {
            playQueueTrack(currentIndex + 1);
        } else if (isPlayingFromQueue) {
            showToast('Fin de la cola de reproducción');
            if (globalAudio) globalAudio.pause();
        } else {
            playNextAlbumTrack();
        }
    }

    function playPrev() {
        if (isPlayingFromQueue && currentIndex > 0) { playQueueTrack(currentIndex - 1); }
        else if (isPlayingFromQueue) { if (globalAudio) globalAudio.currentTime = 0; }
        else { playPrevAlbumTrack(); }
    }

    function playNextAlbumTrack() {
        if (!activeAudio || isPlayingFromQueue) return;
        const audios = Array.from(document.querySelectorAll('.track-item audio'));
        const idx = audios.indexOf(activeAudio);
        if (idx !== -1 && idx + 1 < audios.length) {
            audios[idx + 1].closest('.track-audio-player')?.querySelector('.track-audio-button')?.click();
        } else if (queue.length > 0) {
            playQueueTrack(0);
        }
    }

    function playPrevAlbumTrack() {
        if (!activeAudio || isPlayingFromQueue) return;
        const audios = Array.from(document.querySelectorAll('.track-item audio'));
        const idx = audios.indexOf(activeAudio);
        if (idx > 0) {
            audios[idx - 1].closest('.track-audio-player')?.querySelector('.track-audio-button')?.click();
        } else if (activeAudio) {
            activeAudio.currentTime = 0;
        }
    }

    // --- VOLUMEN ---
    function setGlobalVolume(val) {
        document.getElementById('volumeSlider').value = val;
        const icon = document.getElementById('btnMute').querySelector('i');
        icon.className = `fas fa-volume-${Number(val) === 0 ? 'mute' : Number(val) < 0.5 ? 'down' : 'up'}`;
        document.querySelectorAll('audio').forEach(a => { a.volume = val; });
        saveStateToLocalStorage();
    }

    let lastVolume = 0.8;
    function toggleMute() {
        const vol = document.getElementById('volumeSlider');
        if (Number(vol.value) > 0) { lastVolume = vol.value; setGlobalVolume(0); }
        else { setGlobalVolume(lastVolume); }
    }

    // --- CAJÓN DE LA COLA ---
    function toggleQueueDrawer() {
        queueDrawer.classList.toggle('active');
        updateQueueUI();
    }

    function clearQueue() {
        queue = [];
        currentIndex = -1;
        if (isPlayingFromQueue && globalAudio) {
            globalAudio.pause();
            playerBar.classList.remove('is-playing');
            document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-play"></i>';
        }
        updateQueueUI();
        saveStateToLocalStorage();
        showToast('Cola de reproducción vaciada');
    }

    function removeTrackFromQueue(index) {
        queue.splice(index, 1);
        if (index === currentIndex) {
            if (isPlayingFromQueue && globalAudio) globalAudio.pause();
            currentIndex = Math.min(currentIndex, queue.length - 1);
            if (currentIndex !== -1) playQueueTrack(currentIndex);
            else { activeAudio = null; playerBar.classList.remove('active'); }
        } else if (index < currentIndex) { currentIndex--; }
        updateQueueUI();
        saveStateToLocalStorage();
    }

    function updateQueueUI() {
        const badge = document.getElementById('queueBadge');
        badge.textContent = queue.length;
        badge.classList.toggle('has-items', queue.length > 0);

        const currentSection = document.getElementById('queueCurrentSection');
        if (activeAudio) {
            const isPlaying = playerBar.classList.contains('is-playing');
            currentSection.innerHTML = `
                <div class="current-track-card">
                    <div class="queue-track-cover" style="background-image:${document.getElementById('playerCover').style.backgroundImage}"></div>
                    <div class="queue-track-info">
                        <div class="queue-track-title">${document.getElementById('playerTitle').textContent}</div>
                        <div class="queue-track-album">${document.getElementById('playerArtistAlbum').textContent}</div>
                    </div>
                    ${isPlaying ? '<div style="color:var(--primary-color,#ff0000);font-size:.8rem;flex-shrink:0;"><i class="fas fa-music"></i> En curso</div>' : ''}
                </div>`;
        } else {
            currentSection.innerHTML = '<div class="empty-queue-msg">Ninguna canción sonando</div>';
        }

        const listEl = document.getElementById('queueList');
        if (queue.length === 0) {
            listEl.innerHTML = '<div class="empty-queue-msg">La cola está vacía. Agrega canciones con el botón +.</div>';
            return;
        }

        listEl.innerHTML = queue.map((track, idx) => {
            const isActive = isPlayingFromQueue && idx === currentIndex;
            return `
                <div class="queue-track-item" style="${isActive ? 'border-color:rgba(var(--primary-rgb,255,0,0),.3);background:rgba(var(--primary-rgb,255,0,0),.05);' : ''}">
                    <div class="queue-track-cover" style="background-image:url('${track.coverUrl||''}')"></div>
                    <div class="queue-track-info" id="qItem-${idx}" style="cursor:pointer;">
                        <div class="queue-track-title" style="${isActive ? 'color:var(--primary-color,#ff0000);font-weight:800;' : ''}">${track.title}</div>
                        <div class="queue-track-album">${track.albumTitle}</div>
                    </div>
                    <div class="queue-track-actions">
                        <button class="queue-action-btn" id="qPlay-${idx}" title="Reproducir"><i class="fas fa-play"></i></button>
                        <button class="queue-action-btn delete-btn" id="qDel-${idx}" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>`;
        }).join('');

        queue.forEach((_, idx) => {
            document.getElementById(`qItem-${idx}`)?.addEventListener('click', () => playQueueTrack(idx));
            document.getElementById(`qPlay-${idx}`)?.addEventListener('click', () => playQueueTrack(idx));
            document.getElementById(`qDel-${idx}`)?.addEventListener('click', (e) => { e.stopPropagation(); removeTrackFromQueue(idx); });
        });
    }

    // --- PERSISTENCIA LOCAL STORAGE ---
    function saveStateToLocalStorage() {
        const vol = document.getElementById('volumeSlider')?.value || 0.8;
        let trackData = null;
        if (activeAudio) {
            trackData = {
                title:      document.getElementById('playerTitle').textContent,
                albumTitle: document.getElementById('playerArtistAlbum').textContent.replace('Stray Kids • ', ''),
                coverUrl:   document.getElementById('playerCover').style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1'),
                audioUrl:   activeAudio.src,
                currentTime: activeAudio.currentTime,
                duration:   activeAudio.duration || 0,
                isPlayingFromQueue
            };
        }
        localStorage.setItem('skz_player_state', JSON.stringify({
            queue, currentIndex, volume: vol,
            isPlaying: activeAudio ? !activeAudio.paused : false,
            currentTrack: trackData
        }));
    }

    function throttleSaveState() {
        if (saveTimeout) return;
        saveTimeout = setTimeout(() => { saveStateToLocalStorage(); saveTimeout = null; }, 2000);
    }

    function loadStateFromLocalStorage() {
        const raw = localStorage.getItem('skz_player_state');
        if (!raw) return;
        try {
            const state = JSON.parse(raw);
            if (state.volume !== undefined) setGlobalVolume(state.volume);
            if (state.queue) { queue = state.queue; currentIndex = state.currentIndex ?? -1; }

            if (state.currentTrack) {
                const t = state.currentTrack;
                isPlayingFromQueue = t.isPlayingFromQueue;
                const wasPlaying   = state.isPlaying === true;

                document.getElementById('playerTitle').textContent        = t.title;
                document.getElementById('playerArtistAlbum').textContent  = `Stray Kids • ${t.albumTitle}`;
                document.getElementById('playerCover').style.backgroundImage = t.coverUrl ? `url('${t.coverUrl}')` : '';
                document.getElementById('timeCurrent').textContent         = formatTime(t.currentTime || 0);
                document.getElementById('timeTotal').textContent           = formatTime(t.duration || 0);
                if (t.duration > 0) document.getElementById('progressSlider').value = (t.currentTime / t.duration) * 100;

                playerBar.classList.add('active');
                globalAudio.src    = t.audioUrl;
                globalAudio.volume = state.volume !== undefined ? Number(state.volume) : 0.8;
                activeAudio        = globalAudio;

                if (wasPlaying) {
                    const resumeOnce = () => {
                        globalAudio.removeEventListener('canplay', resumeOnce);
                        globalAudio.currentTime = t.currentTime || 0;
                        globalAudio.play().catch(() => {
                            document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-play"></i>';
                            playerBar.classList.remove('is-playing');
                        });
                    };
                    globalAudio.addEventListener('canplay', resumeOnce);
                    globalAudio.load();
                } else {
                    const seekOnce = () => {
                        globalAudio.removeEventListener('loadedmetadata', seekOnce);
                        globalAudio.currentTime = t.currentTime || 0;
                    };
                    globalAudio.addEventListener('loadedmetadata', seekOnce);
                    globalAudio.load();
                    document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-play"></i>';
                    playerBar.classList.remove('is-playing');
                }
            }
            updateQueueUI();
        } catch (e) {
            console.error('Error cargando estado del player:', e);
        }
    }

    // --- UTILIDADES ---
    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || isNaN(seconds)) return '0:00';
        return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
    }

})();
