from django.urls import path
from .views import PhotoListAPIView, PhotoDetailAPIView

app_name = 'gallery'

urlpatterns = [
    # Rota para a lista de fotos (GET, POST)
    path('api/photos/', PhotoListAPIView.as_view(), name='photo-list'),

    # NOSSA NOVA ROTA para uma foto específica (GET, PUT, DELETE)
    path('api/photos/<int:pk>/', PhotoDetailAPIView.as_view(), name='photo-detail'),
]