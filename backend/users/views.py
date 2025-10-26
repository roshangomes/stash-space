from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

# This is the view for registering a new user
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # Anyone can register, so we use AllowAny
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # We can also generate a token for them right after registering
        token_serializer = CustomTokenObtainPairSerializer(data=request.data)
        token_serializer.is_valid(raise_exception=True)
        
        headers = self.get_success_headers(serializer.data)
        return Response(token_serializer.validated_data, status=status.HTTP_201_CREATED, headers=headers)


# This view overrides the default Simple JWT token view
# to use our custom serializer (which adds the user's role and email)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
