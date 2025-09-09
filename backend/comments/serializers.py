# comments/serializers.py
from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.CharField(), allow_empty=True, required=False
    )

    class Meta:
        model = Comment
        fields = ["id", "author", "text", "created_at", "likes", "images"]
        read_only_fields = ["id", "author", "created_at"]