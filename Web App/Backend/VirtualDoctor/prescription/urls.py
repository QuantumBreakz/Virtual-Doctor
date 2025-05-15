from django.urls import path
from .views import recommend_medicine

urlpatterns = [
    path('prescribe/', recommend_medicine, name='medicine_prescription'),
]