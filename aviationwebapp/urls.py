"""aviationwebapp URL Configuration
The `urlpatterns` list routes URLs to views.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('featured', views.featured),
    path('collection', views.collection),
    path('collection/<str:airline_name>', views.collection),
    path('collection/<str:airline_name>/<str:registration_name>', views.collection),
    path('competition', views.competition),
    path('privacy-policy', views.privacy_policy),
    path('ads.txt', views.ads_txt),
]

handler404 = 'aviationwebapp.views.not_found'
handler500 = 'aviationwebapp.views.error'