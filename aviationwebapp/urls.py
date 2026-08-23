"""aviationwebapp URL Configuration
The `urlpatterns` list routes URLs to views.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('featured', views.featured, name='featured'),
    path('collection', views.collection, name='collection'),
    path('collection/<str:airline_name>', views.collection, name='airline'),
    path('collection/<str:airline_name>/<str:registration_name>', views.collection, name='registration'),
    path('about', views.about, name='about'),
    path('contact', views.contact, name='contact'),
    path('privacy-policy', views.privacy_policy, name='privacy-policy'),
    path('ads.txt', views.ads_txt, name='ads-txt'),
    path('robots.txt', views.robots_txt, name='robots-txt'),
    path('sitemap.xml', views.sitemap, name='sitemap'),
]

handler404 = 'aviationwebapp.views.not_found'
handler500 = 'aviationwebapp.views.error'
