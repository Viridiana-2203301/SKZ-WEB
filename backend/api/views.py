from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.contrib.auth import logout
from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Comment
from .serializers import CommentSerializer
from .csv_auth import authenticate_csv, user_exists


# ─────────────────────────────────────────────
# PÁGINA DE LOGIN (renderiza template HTML)
# ─────────────────────────────────────────────
class LoginPageView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Si ya está autenticado, redirigir al inicio
        if request.session.get('skz_logged_in'):
            from django.shortcuts import redirect
            return redirect('/')
        return render(request, 'login.html')



# ─────────────────────────────────────────────
# CSRF
# ─────────────────────────────────────────────
@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'detail': 'CSRF cookie set'})


# ─────────────────────────────────────────────
# LOGIN  (lee del CSV — sin registro)
# ─────────────────────────────────────────────
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username or not password:
            return Response(
                {'error': 'Ingresa usuario y contraseña.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user_exists(username):
            return Response(
                {'error': 'Usuario o contraseña incorrectos.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if authenticate_csv(username, password):
            # Guardar sesión manual (sin User de Django)
            request.session['skz_user']     = username
            request.session['skz_logged_in'] = True
            request.session.set_expiry(0)  # Sesión dura hasta cerrar el navegador
            return Response({'user': {'username': username}})

        return Response(
            {'error': 'Usuario o contraseña incorrectos.'},
            status=status.HTTP_401_UNAUTHORIZED
        )


# ─────────────────────────────────────────────
# LOGOUT
# ─────────────────────────────────────────────
class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        request.session.flush()
        return Response({'message': 'Sesión cerrada.'})


# ─────────────────────────────────────────────
# ME  (quién está logueado)
# ─────────────────────────────────────────────
class MeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.session.get('skz_logged_in'):
            return Response({'user': {'username': request.session['skz_user']}})
        return Response({'user': None})


# ─────────────────────────────────────────────
# COMENTARIOS
# ─────────────────────────────────────────────
def _session_user(request):
    """Devuelve el username de sesión o None."""
    if request.session.get('skz_logged_in'):
        return request.session.get('skz_user')
    return None


class CommentListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        album_slug = request.query_params.get('album', '')
        if not album_slug:
            return Response({'error': 'Parámetro album requerido.'}, status=400)
        comments = Comment.objects.filter(album_slug=album_slug)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = _session_user(request)
        if not username:
            return Response({'error': 'Inicia sesión para comentar.'}, status=401)

        data = request.data.copy()
        serializer = CommentSerializer(data=data, context={'username': username})
        if serializer.is_valid():
            serializer.save(csv_username=username)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CommentDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        username = _session_user(request)
        if not username:
            return Response({'error': 'No autorizado.'}, status=401)
        try:
            comment = Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            return Response({'message': 'El comentario ya no existe.'}, status=200)

        if comment.csv_username != username:
            return Response({'error': 'No puedes borrar comentarios ajenos.'}, status=403)

        comment.delete()
        return Response({'message': 'Eliminado.'})
