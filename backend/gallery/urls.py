from django.urls import path
from .views import PhotoListAPIView, PhotoDetailAPIView,PersonDetailAPIView,PersonListAPIView,PersonPhotoListAPIView

app_name = 'gallery'

urlpatterns = [
    # Rota para a lista de fotos (GET, POST)
    path('api/photos/', PhotoListAPIView.as_view(), name='photo-list'),

    # NOSSA NOVA ROTA para uma foto específica (GET, PUT, DELETE)
    path('api/photos/<int:pk>/', PhotoDetailAPIView.as_view(), name='photo-detail'),

    path('api/persons/<int:pk>/', PersonDetailAPIView.as_view(), name='person-detail'),

    path('api/persons/', PersonListAPIView.as_view(), name='person-list'),

    path('api/persons/<int:pk>/photos/', PersonPhotoListAPIView.as_view(), name='person-photo-list'),

]