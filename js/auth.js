/* ==========================================================================
   auth.js — Pantalla de acceso con usuario y contraseña
   Los usuarios se definen en backend/users.csv
   ========================================================================== */

function resolveApiBaseUrl() {
    const configuredUrl = window.SKZ_CONFIG?.apiBaseUrl || 'auto';

    if (configuredUrl === 'auto') {
        const localHosts = ['localhost', '127.0.0.1'];

        if (localHosts.includes(window.location.hostname) && window.location.port && window.location.port !== '8000') {
            return `${window.location.protocol}//${window.location.hostname}:8000`;
        }

        return window.location.origin;
    }

    try {
        const apiUrl = new URL(configuredUrl, window.location.origin);
        const localHosts = ['localhost', '127.0.0.1'];

        if (localHosts.includes(apiUrl.hostname) && localHosts.includes(window.location.hostname)) {
            apiUrl.hostname = window.location.hostname;
        }

        return apiUrl.origin;
    } catch (error) {
        return window.location.origin;
    }
}

const SKZ_API_BASE = resolveApiBaseUrl();
const SKZ_API = `${SKZ_API_BASE}/api`;
const SKZ_TAB_AUTH_KEY = 'skz_tab_authenticated';
const SKZ_TAB_AUTH_TOKEN = 'skz:authenticated';
const SKZ_TAB_USER_KEY = 'skz_tab_user';

const Auth = (() => {
    let currentUser = null;
    let csrfToken   = null;
    let authReady   = false;

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
    function markTabAuthenticated(user = currentUser) {
        sessionStorage.setItem(SKZ_TAB_AUTH_KEY, 'true');
        if (user?.username) {
            sessionStorage.setItem(SKZ_TAB_USER_KEY, JSON.stringify({ username: user.username }));
        }
        if (!window.name.includes(SKZ_TAB_AUTH_TOKEN)) {
            window.name = window.name ? `${window.name}|${SKZ_TAB_AUTH_TOKEN}` : SKZ_TAB_AUTH_TOKEN;
        }
    }

    function isTabAuthenticated() {
        return sessionStorage.getItem(SKZ_TAB_AUTH_KEY) === 'true' || window.name.includes(SKZ_TAB_AUTH_TOKEN);
    }

    function clearTabAuthenticated() {
        sessionStorage.removeItem(SKZ_TAB_AUTH_KEY);
        sessionStorage.removeItem(SKZ_TAB_USER_KEY);
        window.name = window.name
            .split('|')
            .filter(value => value && value !== SKZ_TAB_AUTH_TOKEN)
            .join('|');
    }

    function getCachedTabUser() {
        try {
            const user = JSON.parse(sessionStorage.getItem(SKZ_TAB_USER_KEY) || 'null');
            return user?.username ? user : null;
        } catch (error) {
            return null;
        }
    }

    async function checkSession() {
        try {
            const res  = await fetch(`${SKZ_API}/me/`, { credentials: 'include' });
            const data = await res.json();
            currentUser = data.user || null;
        } catch (e) { currentUser = null; }
        return currentUser;
    }

    function notifyAuthReady() {
        authReady = true;
        document.dispatchEvent(new CustomEvent('skz:auth-ready', { detail: currentUser }));
    }

    // ── Login ────────────────────────────────────────────────────────────
    async function loginUser(username, password) {
        try {
            const res  = await fetch(`${SKZ_API}/login/`, {
                method:      'POST',
                credentials: 'include',
                headers:     {
                    'Content-Type': 'application/json',
                    'X-CSRFToken':  csrfToken || getCookie('csrftoken'),
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await readJsonResponse(res);
            if (res.ok) {
                currentUser = data.user;
                markTabAuthenticated(currentUser);
                return { success: true, user: data.user };
            }
            return { success: false, error: data.error || `Error del servidor (${res.status}).` };
        } catch (error) {
            return {
                success: false,
                error: `No se pudo conectar con el backend en ${SKZ_API_BASE}.`,
            };
        }
    }

    async function readJsonResponse(response) {
        const text = await response.text();
        if (!text) return {};

        try {
            return JSON.parse(text);
        } catch (error) {
            return { error: `Respuesta no valida del servidor (${response.status}).` };
        }
    }

    // ── Logout ───────────────────────────────────────────────────────────
    async function logoutUser() {
        try {
            await fetch(`${SKZ_API}/logout/`, {
                method:      'POST',
                credentials: 'include',
                headers:     { 'X-CSRFToken': csrfToken || getCookie('csrftoken') },
            });
        } catch (e) {
            console.error('Error logging out from server:', e);
        }

        // Disparar evento global de logout para limpiar player, cola y estados
        document.dispatchEvent(new CustomEvent('skz:logout'));

        currentUser = null;
        clearTabAuthenticated();
        
        // Redirigir al inicio (index.html) para que la sesión comience desde cero
        const isSubPage = window.location.pathname.includes('/pages/');
        window.location.href = isSubPage ? '../index.html' : 'index.html';
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
            <div class="skz-lock-bg">
                <span class="skz-lock-bubble"></span>
                <span class="skz-lock-bubble"></span>
                <span class="skz-lock-bubble"></span>
                <span class="skz-lock-bubble"></span>
                <span class="skz-lock-bubble"></span>
                <span class="skz-lock-bubble"></span>
                <span class="skz-lock-bubble"></span>
                <span class="skz-lock-bubble"></span>
            </div>
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

        if (!isTabAuthenticated()) {
            currentUser = null;
            showLockScreen();
            notifyAuthReady();
            return;
        }

        const user = await checkSession();

        if (user) {
            // Ya está autenticado: mostrar navbar y contenido normal
            markTabAuthenticated(user);
            updateNavbar();
        } else {
            currentUser = null;
            clearTabAuthenticated();
            showLockScreen();
        }

        notifyAuthReady();
    }

    async function refreshSession() {
        const user = await checkSession();
        if (user) {
            markTabAuthenticated(user);
            updateNavbar();
        }
        return user;
    }

    function syncPageState() {
        if (isTabAuthenticated()) {
            hideLockScreen();
        }
    }

    return {
        init,
        syncPageState,
        refreshSession,
        getCurrentUser: () => currentUser,
        isReady: () => authReady,
        showLockScreen,
        clearTabAuthenticated,
        getCookie,
        getCSRF: () => csrfToken || getCookie('csrftoken'),
        SKZ_API,
    };
})();

document.addEventListener('DOMContentLoaded', () => Auth.init());
window.addEventListener('pageshow', () => Auth.syncPageState());
window.SKZAuth = Auth;
