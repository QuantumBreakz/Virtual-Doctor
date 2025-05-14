from django.urls import path
from . import views

urlpatterns = [
    path('recommend/', views.get_recommendations, name='get_recommendations'),
    path('interactions/', views.check_interactions, name='check_interactions'),
    path('safety/', views.check_safety, name='check_safety'),
] 