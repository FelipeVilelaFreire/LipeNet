
from django.urls import path
from .views import PhotoListAPIView

app_name = 'gallery'

urlpatterns = [
    # Quando a URL for 'api/photos/', chame nossa nova view.
    path('api/photos/', PhotoListAPIView.as_view(), name='photo-list'),
]