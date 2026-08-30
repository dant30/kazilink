from rest_framework_simplejwt.tokens import RefreshToken


def issue_tokens(user):
	tokens = RefreshToken.for_user(user)
	return {'refresh': str(tokens), 'access': str(tokens.access_token)}


def authenticate_user(phone, password):
	from django.contrib.auth import authenticate

	user = authenticate(phone=phone, password=password)
	if user is None or not user.is_active or not user.is_phone_verified:
		return None
	return user
