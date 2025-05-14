from django.urls import path
from . import views

urlpatterns = [
    path('process/', views.process_audio, name='process_audio'),
    path('transcribe/', views.transcribe_audio, name='transcribe_audio'),
    path('analyze/', views.analyze_audio, name='analyze_audio'),
] 