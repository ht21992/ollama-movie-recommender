# api/urls.py

from django.urls import path
from .views import MovieRecommendationView

urlpatterns = [
    path("recommend/", MovieRecommendationView.as_view(), name="movie_recommendation"),
]
