from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model  = Comment
        fields = ['id', 'username', 'csv_username', 'album_slug', 'texto', 'created_at']
        read_only_fields = ['id', 'csv_username', 'created_at']

    def get_username(self, obj):
        return obj.csv_username

    def create(self, validated_data):
        csv_username = validated_data.pop('csv_username', None) or self.context.get('username', 'Anónimo')
        return Comment.objects.create(csv_username=csv_username, **validated_data)
