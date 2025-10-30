from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser

# --- Make sure this import line is correct ---
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, UserSerializer

# This view handles registration (POST to /api/register/)
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny] # Allow anyone to register
    serializer_class = RegisterSerializer

    # This function logs the user in immediately after they register
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # --- THIS IS THE FIX ---
        # We must create a new dictionary with ONLY the email and password
        # for the login serializer.
        token_data = {
            "email": user.email, # Use the email from the user we just created
            "password": request.data.get("password") # Get the plain password from the request
        }
        token_serializer = CustomTokenObtainPairSerializer(data=token_data)
        # ---------------------
        
        token_serializer.is_valid(raise_exception=True)
        
        # Return both user data and tokens
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            **token_serializer.validated_data
        }, status=201)

# This view handles login (POST to /api/token/)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# This view gets the user's profile (GET to /api/user/profile/)
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] # Only allow logged-in users

    def get_object(self):
        # Returns the user associated with the token
        return self.request.user