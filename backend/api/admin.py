from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display  = ['id', 'csv_username', 'album_slug', 'texto', 'created_at']
    list_filter   = ['album_slug']
    search_fields = ['csv_username', 'texto']
    ordering      = ['-created_at']
