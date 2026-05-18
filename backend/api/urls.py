from django.urls import path
from .views import (
    LoginPageView,
    CSRFView, LoginView, LogoutView, MeView,
    CommentListCreateView, CommentDeleteView,
)

urlpatterns = [
    path('login/',              LoginPageView.as_view(),        name='login-page'),
    path('api/csrf/',           CSRFView.as_view(),             name='csrf'),
    path('api/login/',          LoginView.as_view(),            name='login'),
    path('api/logout/',         LogoutView.as_view(),           name='logout'),
    path('api/me/',             MeView.as_view(),               name='me'),
    path('api/comments/',       CommentListCreateView.as_view(), name='comments'),
    path('api/comments/<int:pk>/', CommentDeleteView.as_view(), name='comment-delete'),
]
