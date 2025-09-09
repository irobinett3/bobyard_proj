from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from comments.views import CommentViewSet

router = DefaultRouter()  # api router
router.register(r"comments", CommentViewSet, basename="comment")  # comments endpoint

urlpatterns = [
    path("admin/", admin.site.urls),  # admin ui
    path("api/", include(router.urls)),  # api routes
]