/* ==========================================================================
   auth.js — Pantalla de acceso con usuario y contraseña
   Los usuarios se definen en backend/users.csv
   ========================================================================== */

const SKZ_API = `${window.location.origin}/api`;

const Auth = (() => {
    let currentUser = null;
    let csrfToken   = null;

    // ── Obtener cookie CSRF ──────────────────────────────────────────────
    async function fetchCSRF() {
        try {
            await fetch(`${SKZ_API}/csrf/`, { credentials: 'include' });
            csrfToken = getCookie('csrftoken');
        } catch (e) { /* backend no disponible */ }
    }

    function getCookie(name) {
        const val = `; ${document.cookie}`;
        const parts = val.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // ── Verificar sesión activa ──────────────────────────────────────────
    async function checkSession() {
        try {
            const res  = await fetch(`${SKZ_API}/me/`, { credentials: 'include' });
            const data = await res.json();
            currentUser = data.user || null;
        } catch (e) { currentUser = null; }
        return currentUser;
    }

    // ── Login ────────────────────────────────────────────────────────────
    async function loginUser(username, password) {
        const res  = await fetch(`${SKZ_API}/login/`, {
            method:      'POST',
            credentials: 'include',
            headers:     {
                'Content-Type': 'application/json',
                'X-CSRFToken':  csrfToken || getCookie('csrftoken'),
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok) {
            currentUser = data.user;
            return { success: true, user: data.user };
        }
        return { success: false, error: data.error };
    }

    // ── Logout ───────────────────────────────────────────────────────────
    async function logoutUser() {
        await fetch(`${SKZ_API}/logout/`, {
            method:      'POST',
            credentials: 'include',
            headers:     { 'X-CSRFToken': csrfToken || getCookie('csrftoken') },
        });
        currentUser = null;
        // Volver a mostrar la pantalla de bloqueo
        showLockScreen();
    }

    // ── Actualizar navbar ────────────────────────────────────────────────
    function updateNavbar() {
        const existing = document.getElementById('skz-auth-nav-item');
        if (existing) existing.remove();

        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu || !currentUser) return;

        const li = document.createElement('li');
        li.id = 'skz-auth-nav-item';
        li.innerHTML = `
            <div class="skz-user-menu" id="skzUserMenu">
                <span class="skz-user-avatar">${currentUser.username.charAt(0).toUpperCase()}</span>
                <span class="skz-username">${currentUser.username}</span>
                <div class="skz-user-dropdown" id="skzUserDropdown">
                    <button id="skzLogoutBtn" class="skz-dropdown-item">
                        <i class="fas fa-sign-out-alt"></i> Cerrar sesión
                    </button>
                </div>
            </div>`;
        navMenu.appendChild(li);

        document.getElementById('skzUserMenu').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('skzUserDropdown').classList.toggle('active');
        });
        document.getElementById('skzLogoutBtn').addEventListener('click', () => logoutUser());
        document.addEventListener('click', () => {
            document.getElementById('skzUserDropdown')?.classList.remove('active');
        });
    }

    // ════════════════════════════════════════════════════════════════════
    // PANTALLA DE BLOQUEO — Cubre toda la página hasta que el usuario
    // ingrese credenciales válidas del CSV
    // ════════════════════════════════════════════════════════════════════
    function showLockScreen() {
        // Ocultar el contenido de la página mientras no esté autenticado
        document.body.style.overflow = 'hidden';

        let screen = document.getElementById('skz-lock-screen');
        if (screen) { screen.style.display = 'flex'; return; }

        screen = document.createElement('div');
        screen.id = 'skz-lock-screen';
        screen.innerHTML = `
            <div class="skz-lock-bg"></div>
            <div class="skz-lock-card">
                <div class="skz-lock-logo">
                    <i class="fas fa-play"></i>
                </div>
                <h1 class="skz-lock-title">STRAY KIDS</h1>
                <p class="skz-lock-subtitle">Discografía Oficial</p>
                <p class="skz-lock-desc">Ingresa tus credenciales para acceder</p>

                <form id="skzLockForm" autocomplete="on">
                    <div class="skz-lock-field">
                        <i class="fas fa-user"></i>
                        <input
                            type="text"
                            id="lockUsername"
                            name="username"
                            placeholder="Usuario"
                            autocomplete="username"
                            required
                        >
                    </div>
                    <div class="skz-lock-field">
                        <i class="fas fa-lock"></i>
                        <input
                            type="password"
                            id="lockPassword"
                            name="password"
                            placeholder="Contraseña"
                            autocomplete="current-password"
                            required
                        >
                    </div>
                    <div class="skz-lock-error" id="lockError"></div>
                    <button type="submit" class="skz-lock-btn" id="lockSubmitBtn">
                        <span>Entrar</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(screen);

        document.getElementById('skzLockForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn      = document.getElementById('lockSubmitBtn');
            const errorEl  = document.getElementById('lockError');
            const username = document.getElementById('lockUsername').value.trim();
            const password = document.getElementById('lockPassword').value;

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
            errorEl.textContent = '';
            errorEl.style.display = 'none';

            const result = await loginUser(username, password);

            if (result.success) {
                hideLockScreen();
                updateNavbar();
                document.dispatchEvent(new CustomEvent('skz:login', { detail: result.user }));
            } else {
                errorEl.textContent = result.error || 'Credenciales incorrectas.';
                errorEl.style.display = 'block';
                // Animar el card para indicar error
                const card = screen.querySelector('.skz-lock-card');
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 600);
            }

            btn.disabled = false;
            btn.innerHTML = '<span>Entrar</span><i class="fas fa-arrow-right"></i>';
        });
    }

    function hideLockScreen() {
        const screen = document.getElementById('skz-lock-screen');
        if (screen) {
            screen.classList.add('unlocking');
            setTimeout(() => {
                screen.style.display = 'none';
                screen.classList.remove('unlocking');
            }, 500);
        }
        document.body.style.overflow = '';
    }

    // ── Inicialización ───────────────────────────────────────────────────
    async function init() {
        await fetchCSRF();
        const user = await checkSession();

        if (user) {
            // Ya está autenticado: mostrar navbar y contenido normal
            updateNavbar();
        } else {
            // No autenticado: bloquear toda la página
            showLockScreen();
        }
    }

    return {
        init,
        getCurrentUser: () => currentUser,
        getCookie,
        getCSRF: () => csrfToken || getCookie('csrftoken'),
        SKZ_API,
    };
})();

document.addEventListener('DOMContentLoaded', () => Auth.init());
window.SKZAuth = Auth;
