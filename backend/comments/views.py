from rest_framework import mixins, viewsets
from .models import Comment
from .serializers import CommentSerializer

class CommentViewSet(mixins.ListModelMixin,
                     mixins.CreateModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):
    queryset = Comment.objects.all()  # all comments
    serializer_class = CommentSerializer  # serializer

    def perform_create(self, serializer):
        serializer.save(author="Admin")  # force author