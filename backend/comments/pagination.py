from urllib.parse import urlparse, parse_qs
from rest_framework.pagination import CursorPagination
from rest_framework.response import Response

class CommentCursorPagination(CursorPagination):
    page_size = 50
    cursor_query_param = "cursor"
    ordering = ("-created_at", "-id")

    def _link_to_token(self, link: str | None) -> str | None:
        if not link:
            return None
        qs = parse_qs(urlparse(link).query)
        vals = qs.get(self.cursor_query_param)
        return vals[0] if vals else None

    def get_paginated_response(self, data):
        next_link = self.get_next_link()
        prev_link = self.get_previous_link()
        return Response({
            "results": data,
            "next": self._link_to_token(next_link),
            "previous": self._link_to_token(prev_link),
        })