from django.urls import path
from . import views

app_name = 'spell'

urlpatterns = [
    path('', views.spell_loby, name='loby'),
    path('room/', views.spell_room, name='room'),
]
