from django.urls import path
from . import views

urlpatterns = [
    path('analyze/', views.analyze_sentiment, name='analyze_sentiment'),
    path('batch-analyze/', views.batch_analyze_sentiment, name='batch_analyze_sentiment'),
] 