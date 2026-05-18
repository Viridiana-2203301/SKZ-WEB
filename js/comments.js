/* ==========================================================================
   comments.js — Sección de comentarios por álbum
   Requiere auth.js cargado antes.
   ========================================================================== */

const Comments = (() => {
    // El slug del álbum se lee del data-album-slug del contenedor
    let albumSlug  = '';
    let currentUser = null;

    // --- INICIALIZAR ---
    function init() {
        const section = document.getElementById('skz-comments-section');
        if (!section) return;

        albumSlug = section.dataset.albumSlug || '';
        if (!albumSlug) { console.warn('comments.js: falta data-album-slug'); return; }

        // Esperar que Auth haya resuelto la sesión
        const tryInit = async () => {
            currentUser = window.SKZAuth?.getCurrentUser() || null;
            renderForm();
            await loadComments();
        };

        if (document.readyState === 'complete') {
            setTimeout(tryInit, 300); // auth.js puede estar inicializando
        } else {
            window.addEventListener('load', () => setTimeout(tryInit, 300));
        }

        // Escuchar eventos de login/logout
        document.addEventListener('skz:login',  (e) => { currentUser = e.detail; renderForm(); });
        document.addEventListener('skz:logout', ()  => { currentUser = null; renderForm(); });
    }

    // --- CARGAR COMENTARIOS ---
    async function loadComments() {
        const list = document.getElementById('skz-comments-list');
        if (!list) return;

        list.innerHTML = `<div class="skz-comments-loading"><i class="fas fa-spinner fa-spin"></i> Cargando comentarios...</div>`;

        try {
            const res = await fetch(`${window.SKZAuth.SKZ_API}/comments/?album=${albumSlug}`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Error de red');
            const comments = await res.json();
            renderComments(comments);
        } catch (e) {
            list.innerHTML = `<div class="skz-comments-empty"><i class="fas fa-exclamation-circle"></i> No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en <strong>localhost:8000</strong>.</div>`;
        }
    }

    // --- RENDERIZAR COMENTARIOS ---
    function renderComments(comments) {
        const list = document.getElementById('skz-comments-list');
        if (!list) return;

        const count = document.getElementById('skz-comments-count');
        if (count) count.textContent = comments.length === 1 ? '1 comentario' : `${comments.length} comentarios`;

        if (comments.length === 0) {
            list.innerHTML = `
                <div class="skz-comments-empty">
                    <i class="fas fa-comment-dots"></i>
                    <p>Sé el primero en comentar este álbum.</p>
                </div>`;
            return;
        }

        list.innerHTML = comments.map(c => {
            const isOwn   = currentUser && currentUser.id === c.user_id;
            const initial = c.username.charAt(0).toUpperCase();
            const date    = formatDate(c.created_at);

            return `
                <div class="skz-comment-card" id="comment-${c.id}">
                    <div class="skz-comment-avatar">${initial}</div>
                    <div class="skz-comment-body">
                        <div class="skz-comment-meta">
                            <span class="skz-comment-username">${escHtml(c.username)}</span>
                            <span class="skz-comment-date">${date}</span>
                        </div>
                        <p class="skz-comment-text">${escHtml(c.texto)}</p>
                    </div>
                    ${isOwn ? `
                    <button class="skz-comment-delete" data-id="${c.id}" title="Eliminar comentario">
                        <i class="fas fa-trash-alt"></i>
                    </button>` : ''}
                </div>`;
        }).join('');

        // Botones de borrado
        list.querySelectorAll('.skz-comment-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteComment(Number(btn.dataset.id)));
        });
    }

    // --- RENDERIZAR FORMULARIO ---
    function renderForm() {
        const formContainer = document.getElementById('skz-comment-form-container');
        if (!formContainer) return;

        if (currentUser) {
            formContainer.innerHTML = `
                <div class="skz-comment-form-header">
                    <div class="skz-comment-form-avatar">${currentUser.username.charAt(0).toUpperCase()}</div>
                    <span class="skz-comment-form-user">${escHtml(currentUser.username)}</span>
                </div>
                <form id="skzCommentForm">
                    <textarea id="skzCommentText" placeholder="Escribe tu comentario sobre este álbum..." rows="3" maxlength="1000" required></textarea>
                    <div class="skz-comment-form-footer">
                        <span class="skz-char-count" id="skzCharCount">0 / 1000</span>
                        <button type="submit" class="skz-comment-submit" id="skzCommentSubmit">
                            <i class="fas fa-paper-plane"></i> Publicar
                        </button>
                    </div>
                    <div class="skz-comments-error" id="skzCommentError"></div>
                </form>`;

            const textarea = document.getElementById('skzCommentText');
            const charCount = document.getElementById('skzCharCount');
            textarea.addEventListener('input', () => {
                charCount.textContent = `${textarea.value.length} / 1000`;
            });

            document.getElementById('skzCommentForm').addEventListener('submit', submitComment);
        } else {
            formContainer.innerHTML = `
                <div class="skz-login-prompt">
                    <i class="fas fa-lock"></i>
                    <p>Inicia sesión para dejar tu comentario</p>
                    <button class="skz-login-prompt-btn" id="skzCommentsLoginBtn">
                        <i class="fas fa-user"></i> Iniciar Sesión / Registrarse
                    </button>
                </div>`;

            document.getElementById('skzCommentsLoginBtn')?.addEventListener('click', () => {
                window.SKZAuth?.openModal('login');
            });
        }
    }

    // --- ENVIAR COMENTARIO ---
    async function submitComment(e) {
        e.preventDefault();
        const textarea = document.getElementById('skzCommentText');
        const errorEl  = document.getElementById('skzCommentError');
        const btn      = document.getElementById('skzCommentSubmit');
        const texto    = textarea.value.trim();

        if (!texto) return;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publicando...';
        if (errorEl) errorEl.textContent = '';

        try {
            const res = await fetch(`${window.SKZAuth.SKZ_API}/comments/`, {
                method:      'POST',
                credentials: 'include',
                headers:     {
                    'Content-Type': 'application/json',
                    'X-CSRFToken':  window.SKZAuth.getCSRF(),
                },
                body: JSON.stringify({ album_slug: albumSlug, texto }),
            });

            if (res.ok) {
                textarea.value = '';
                document.getElementById('skzCharCount').textContent = '0 / 1000';
                await loadComments();
            } else {
                const data = await res.json();
                if (errorEl) errorEl.textContent = data.error || JSON.stringify(data);
            }
        } catch (err) {
            if (errorEl) errorEl.textContent = 'Error de conexión con el servidor.';
        }

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Publicar';
    }

    // --- BORRAR COMENTARIO ---
    async function deleteComment(id) {
        if (!confirm('¿Eliminar este comentario?')) return;

        try {
            const res = await fetch(`${window.SKZAuth.SKZ_API}/comments/${id}/`, {
                method:      'DELETE',
                credentials: 'include',
                headers:     { 'X-CSRFToken': window.SKZAuth.getCSRF() },
            });
            if (res.ok) {
                const card = document.getElementById(`comment-${id}`);
                if (card) {
                    card.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => { card.remove(); loadComments(); }, 300);
                }
            }
        } catch (err) {
            alert('Error al eliminar el comentario.');
        }
    }

    // --- UTILIDADES ---
    function escHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    function formatDate(isoStr) {
        const d = new Date(isoStr);
        return d.toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => Comments.init());
window.SKZComments = Comments;
