from django.urls import path
from .views import (
    PhotoListAPIView, 
    PhotoDetailAPIView,
    PersonDetailAPIView,
    PersonListAPIView,
    PersonPhotoListAPIView,
    UpdatePersonPhotoAPIView,
    SearchView
)

app_name = 'gallery'

urlpatterns = [
    path('api/photos/', PhotoListAPIView.as_view(), name='photo-list'),
    path('api/photos/<int:pk>/', PhotoDetailAPIView.as_view(), name='photo-detail'),
    path('api/persons/', PersonListAPIView.as_view(), name='person-list'),
    path('api/persons/<int:pk>/', PersonDetailAPIView.as_view(), name='person-detail'),
    path('api/persons/<int:pk>/update-photo/', UpdatePersonPhotoAPIView.as_view(), name='person-update-photo'),
    path('api/persons/<int:pk>/photos/', PersonPhotoListAPIView.as_view(), name='person-photo-list'),
    path('api/search/', SearchView.as_view(), name='photo-search'),
]