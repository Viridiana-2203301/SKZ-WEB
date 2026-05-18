"""
Middleware que protege todas las páginas HTML.
Si el usuario no está autenticado, redirige a /login/
"""

EXEMPT_PREFIXES = ['/api/', '/login/']
STATIC_EXTENSIONS = (
    '.css', '.js', '.png', '.jpg', '.jpeg', '.gif',
    '.svg', '.ico', '.woff', '.woff2', '.ttf',
    '.mp3', '.mp4', '.webp', '.webm', '.json',
)


class LoginRequiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path

        # Siempre permitir: rutas del API y la página de login
        if any(path.startswith(p) for p in EXEMPT_PREFIXES):
            return self.get_response(request)

        # Siempre permitir: archivos estáticos (CSS, JS, imágenes, audio…)
        if path.endswith(STATIC_EXTENSIONS):
            return self.get_response(request)

        # Para cualquier otra ruta (páginas HTML), verificar sesión
        if not request.session.get('skz_logged_in'):
            from django.shortcuts import redirect
            # Guardar la URL destino para redirigir después del login
            next_url = path if path != '/' else ''
            login_url = '/login/'
            if next_url and next_url != '/login/':
                login_url = f'/login/?next={next_url}'
            return redirect(login_url)

        return self.get_response(request)
