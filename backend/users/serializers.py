# from rest_framework import serializers
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from django.contrib.auth import get_user_model

# # Get the CustomUser model
# User = get_user_model()

# # This serializer is for registering new users
# class UserRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
#     password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label="Confirm password")

#     class Meta:
#         model = User
#         fields = ('email', 'first_name', 'last_name', 'password', 'password2', 'role')
#         extra_kwargs = {
#             'first_name': {'required': True},
#             'last_name': {'required': True},
#             'role': {'required': True} # Make sure React app sends this
#         }

#     def validate(self, attrs):
#         if attrs['password'] != attrs['password2']:
#             raise serializers.ValidationError({"password": "Password fields didn't match."})
#         # We need to remove password2 as our CustomUser model doesn't have it
#         attrs.pop('password2')
#         return attrs

#     def create(self, validated_data):
#         # We use our custom create_user method from the model manager
#         user = User.objects.create_user(
#             email=validated_data['email'],
#             first_name=validated_data['first_name'],
#             last_name=validated_data['last_name'],
#             password=validated_data['password'],
#             role=validated_data['role'] # This is key!
#         )
#         return user


# # This serializer adds custom claims (like role and email) to the JWT token
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)

#         # Add custom claims to the token payload
#         token['email'] = user.email
#         token['role'] = user.role
#         token['first_name'] = user.first_name

#         return token
    
#     def validate(self, attrs):
#         # This adds the user info to the /api/token/ (login) response
#         data = super().validate(attrs)
        
#         # Add user info to the response
#         data['user'] = {
#             'id': self.user.id,
#             'email': self.user.email,
#             'role': self.user.role,
#             'first_name': self.user.first_name,
#             'last_name': self.user.last_name,
#         }
#         return data


from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user data to the response
        data['user'] = UserSerializer(self.user).data
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'business_name', 'is_kyc_verified')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    # --- ADD business_name ---
    business_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    # -----------------------

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'password2', 'first_name', 'last_name', 'role', 'business_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data['role'],
            # --- ADD business_name ---
            business_name=validated_data.get('business_name', '')
            # -----------------------
        )
        user.set_password(validated_data['password'])
        user.save()
        return user