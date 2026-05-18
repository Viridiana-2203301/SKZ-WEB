from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.http import Http404
import os

PUBLIC_FRONTEND_FILES = {'index.html', 'albums.html', 'dashboard.html'}
PUBLIC_FRONTEND_DIRS = {'css', 'data', 'js', 'pages'}


def serve_frontend(request, path=''):
    """Sirve cualquier archivo del directorio raíz del frontend."""
    if not path or path == '/':
        path = 'index.html'
    normalized_path = os.path.normpath(path).replace('\\', '/')
    first_segment = normalized_path.split('/', 1)[0]

    if (
        normalized_path.startswith('../')
        or (
            normalized_path not in PUBLIC_FRONTEND_FILES
            and first_segment not in PUBLIC_FRONTEND_DIRS
        )
    ):
        raise Http404

    full_path = os.path.abspath(os.path.join(settings.FRONTEND_DIR, normalized_path))
    frontend_dir = os.path.abspath(settings.FRONTEND_DIR)

    if not full_path.startswith(frontend_dir + os.sep):
        raise Http404
    if os.path.isfile(full_path):
        from django.http import FileResponse
        import mimetypes
        content_type, _ = mimetypes.guess_type(full_path)
        return FileResponse(open(full_path, 'rb'), content_type=content_type or 'application/octet-stream')
    raise Http404


urlpatterns = [
    path('admin/', admin.site.urls),

    # Login page y todos los endpoints del API
    path('', include('api.urls')),

    # Frontend: index y cualquier archivo estático
    path('', serve_frontend, {'path': 'index.html'}),
    re_path(r'^(?P<path>.+)$', serve_frontend),
]
