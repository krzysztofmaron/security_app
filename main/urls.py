from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.base, name='base'),
    path('incidents', views.incidents, name='incidents'),
    path('statistics', views.statistics, name='statistics'),
    path('calendar', views.calendar, name='calendar'),
    path('documents', views.documents, name='documents'),


    path('api/incidents', views.incidents_list, name='incidents_list'),
]