from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.throttling import LoginRateThrottle, OTPRateThrottle

from ..serializers import (
	LoginSerializer,
	PhoneVerificationSerializer,
	ProfileSerializer,
	RegistrationSerializer,
	UserSerializer,
)
from ..services.authentication import issue_tokens
from ..services.registration import register_user
from ..services.verification import verify_phone


class RegisterView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [OTPRateThrottle]

	def post(self, request):
		serializer = RegistrationSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			user, otp = register_user(**serializer.validated_data)
		except (ValueError, RuntimeError) as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		data = {'user': UserSerializer(user).data, 'message': 'Verification code sent by SMS.'}
		if settings.DEBUG:
			data['verification_code'] = otp
		return Response(data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [LoginRateThrottle]

	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		return Response({'user': UserSerializer(serializer.validated_data['user']).data, 'tokens': issue_tokens(serializer.validated_data['user'])})


class VerifyPhoneView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [OTPRateThrottle]

	def post(self, request):
		serializer = PhoneVerificationSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			user = verify_phone(**serializer.validated_data)
		except ValueError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		return Response({'user': UserSerializer(user).data, 'tokens': issue_tokens(user)})


class MeView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		return Response(UserSerializer(request.user).data)

	def patch(self, request):
		serializer = UserSerializer(request.user, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data)


class ProfileView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		return Response(ProfileSerializer(request.user.profile).data)

	def patch(self, request):
		serializer = ProfileSerializer(request.user.profile, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data)
