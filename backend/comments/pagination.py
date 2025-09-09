from rest_framework.pagination import CursorPagination

class CommentCursorPagination(CursorPagination):
    page_size = 50
    ordering = "-created_at" 