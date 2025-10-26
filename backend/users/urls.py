#Users App URLS

from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # /api/register/
    path('register/', RegisterView.as_view(), name='register'),
    
    # /api/token/ (this is the login endpoint)
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # /api/token/refresh/ (to get a new access token using a refresh token)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
