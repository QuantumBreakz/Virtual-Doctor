# sentiment/urls.py
from django.urls import path
from .views import analyze_sentiment

urlpatterns = [
    path('', analyze_sentiment, name='analyze_sentiment'),
]