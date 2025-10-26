#MainProject URLS
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # --- Add this line ---
    # This will make our user auth URLs available at /api/...
    path('api/', include('users.urls')),
]
