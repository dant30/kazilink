from rest_framework_simplejwt.authentication import JWTAuthentication


class PhoneJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        if not user.is_active:
            raise self.user_model.DoesNotExist
        return user
