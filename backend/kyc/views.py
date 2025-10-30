from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import KycProfile
from .serializers import KycProfileSerializer

class SubmitKycView(generics.CreateAPIView):
    serializer_class = KycProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Link the KYC profile to the currently logged-in user
        kyc_profile = serializer.save(user=self.request.user, is_verified=True)
        
        # Update the user model as well
        user = self.request.user
        user.is_kyc_verified = True
        user.save()