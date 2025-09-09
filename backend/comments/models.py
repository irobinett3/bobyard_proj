import uuid
from django.db import models

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # uuid pk
    author = models.CharField(max_length=120)  # name/user
    text = models.TextField()  # body text
    created_at = models.DateTimeField(auto_now_add=True)  # timestamp
    likes = models.IntegerField(default=0)  # like count
    images = models.JSONField(default=list, blank=True)  # list of img urls

    class Meta:
        ordering = ["-created_at"]  # newest first