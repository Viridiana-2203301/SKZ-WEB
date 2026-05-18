from django.db import models


class Comment(models.Model):
    # Guardamos el username como texto (viene del CSV, no del User de Django)
    csv_username = models.CharField(max_length=150, db_index=True)
    album_slug   = models.CharField(max_length=100, db_index=True)
    texto        = models.TextField(max_length=1000)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.csv_username} | {self.album_slug} | {self.texto[:40]}'
