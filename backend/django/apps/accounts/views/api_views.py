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
	PasswordResetConfirmSerializer,
	PasswordResetRequestSerializer,
	PasswordResetVerifySerializer,
)
from ..services.authentication import issue_tokens
from ..services.registration import register_user
from ..services.verification import verify_phone
from ..services.password_reset import request_password_reset, reset_password, verify_password_reset


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


class PasswordResetRequestView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [OTPRateThrottle]

	def post(self, request):
		serializer = PasswordResetRequestSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		code = request_password_reset(phone=serializer.validated_data['phone'])
		data = {'message': 'If an account exists for that phone number, a reset code has been sent.'}
		if settings.DEBUG and code:
			data['verification_code'] = code
		return Response(data)


class PasswordResetVerifyView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [OTPRateThrottle]

	def post(self, request):
		serializer = PasswordResetVerifySerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			token = verify_password_reset(**serializer.validated_data)
		except ValueError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		return Response({'reset_token': token, 'message': 'Code verified. Set your new password.'})


class PasswordResetConfirmView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [OTPRateThrottle]

	def post(self, request):
		serializer = PasswordResetConfirmSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			reset_password(
				phone=serializer.validated_data['phone'],
				reset_token=serializer.validated_data['reset_token'],
				new_password=serializer.validated_data['new_password'],
			)
		except ValueError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		return Response({'message': 'Password reset successful. You can now sign in.'})


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
