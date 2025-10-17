from django.urls import path
from .views import (
    PhotoListAPIView,
    PhotoPreviewAPIView,
    PhotoDetailAPIView,
    PersonDetailAPIView,
    PersonListAPIView,
    PersonPhotoListAPIView,
    UpdatePersonPhotoAPIView,
    SearchView,
    ToggleFavoriteAPIView,
    FavoritePhotosAPIView,
    HiddenPersonsAPIView,
    AddPersonManuallyAPIView
)

app_name = 'gallery'

urlpatterns = [
    path('api/photos/', PhotoListAPIView.as_view(), name='photo-list'),
    path('api/photos/preview/', PhotoPreviewAPIView.as_view(), name='photo-preview'),
    path('api/photos/<int:pk>/', PhotoDetailAPIView.as_view(), name='photo-detail'),
    path('api/photos/<int:pk>/toggle-favorite/', ToggleFavoriteAPIView.as_view(), name='photo-toggle-favorite'),
    path('api/favorites/', FavoritePhotosAPIView.as_view(), name='photo-favorites'),
    path('api/persons/', PersonListAPIView.as_view(), name='person-list'),
    path('api/persons/hidden/', HiddenPersonsAPIView.as_view(), name='person-hidden'),
    path('api/persons/<int:pk>/', PersonDetailAPIView.as_view(), name='person-detail'),
    path('api/persons/<int:pk>/add-manually/', AddPersonManuallyAPIView.as_view(), name='person-add-manually'),
    path('api/persons/<int:pk>/update-photo/', UpdatePersonPhotoAPIView.as_view(), name='person-update-photo'),
    path('api/persons/<int:pk>/photos/', PersonPhotoListAPIView.as_view(), name='person-photo-list'),
    path('api/search/', SearchView.as_view(), name='photo-search'),
]