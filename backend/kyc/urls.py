from django.urls import path
from .views import SubmitKycView

urlpatterns = [
    path('submit/', SubmitKycView.as_view(), name='submit-kyc'),
]