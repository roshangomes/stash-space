from django.db import models
from users.models import CustomUser # Import your user model

class KycProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='kyc_profile')
    aadhaar_number = models.CharField(max_length=16, blank=True) # Store securely, e.g., last 4 digits
    name = models.CharField(max_length=255, blank=True)
    dob = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    verification_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"KYC for {self.user.email}"