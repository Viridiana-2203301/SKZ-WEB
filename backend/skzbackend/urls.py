from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
import os


def serve_frontend(request, path=''):
    """Sirve cualquier archivo del directorio raíz del frontend."""
    if not path or path == '/':
        path = 'index.html'
    full_path = os.path.join(settings.FRONTEND_DIR, path)
    if os.path.isfile(full_path):
        from django.http import FileResponse
        import mimetypes
        content_type, _ = mimetypes.guess_type(full_path)
        return FileResponse(open(full_path, 'rb'), content_type=content_type or 'application/octet-stream')
    from django.http import Http404
    raise Http404


urlpatterns = [
    path('admin/', admin.site.urls),

    # Login page y todos los endpoints del API
    path('', include('api.urls')),

    # Frontend: index y cualquier archivo estático
    path('', serve_frontend, {'path': 'index.html'}),
    re_path(r'^(?P<path>.+)$', serve_frontend),
]
