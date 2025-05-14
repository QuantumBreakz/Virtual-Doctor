"""
URL configuration for virtual_doctor project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/sentiment/', include('sentiment_analysis.urls')),
    path('api/emotion/', include('emotion_detection.urls')),
    path('api/medicine/', include('medicine_prescription.urls')),
    path('api/audio/', include('audio_processing.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 