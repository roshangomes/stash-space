from rest_framework import serializers
from .models import KycProfile

class KycProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = KycProfile
        # We only need to receive these fields from the frontend
        fields = ('aadhaar_number', 'name', 'dob', 'address', 'is_verified', 'verification_timestamp')