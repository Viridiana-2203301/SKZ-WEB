from django.urls import path
from .views import (
    LoginPageView,
    CSRFView, LoginView, LogoutView, MeView,
    CommentListCreateView, CommentDeleteView,
)

urlpatterns = [
    path('login/',              LoginPageView.as_view(),        name='login-page'),
    path('api/csrf/',           CSRFView.as_view(),             name='csrf'),
    path('api/csrf',            CSRFView.as_view(),             name='csrf-no-slash'),
    path('api/login/',          LoginView.as_view(),            name='login'),
    path('api/login',           LoginView.as_view(),            name='login-no-slash'),
    path('api/logout/',         LogoutView.as_view(),           name='logout'),
    path('api/logout',          LogoutView.as_view(),           name='logout-no-slash'),
    path('api/me/',             MeView.as_view(),               name='me'),
    path('api/me',              MeView.as_view(),               name='me-no-slash'),
    path('api/comments/',       CommentListCreateView.as_view(), name='comments'),
    path('api/comments',        CommentListCreateView.as_view(), name='comments-no-slash'),
    path('api/comments/<int:pk>/', CommentDeleteView.as_view(), name='comment-delete'),
    path('api/comments/<int:pk>',  CommentDeleteView.as_view(), name='comment-delete-no-slash'),
]
