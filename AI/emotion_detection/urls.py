from django.urls import path
from . import views

urlpatterns = [
    path('detect/', views.detect_emotion, name='detect_emotion'),
    path('batch-detect/', views.batch_detect_emotion, name='batch_detect_emotion'),
] 