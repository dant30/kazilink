from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
	def create_user(self, phone, full_name, password=None, **extra_fields):
		if not phone:
			raise ValueError('A phone number is required.')
		user = self.model(phone=phone, full_name=full_name, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, phone, full_name, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		return self.create_user(phone, full_name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
	phone = models.CharField(max_length=15, unique=True)
	email = models.EmailField(blank=True, null=True)
	full_name = models.CharField(max_length=255)
	is_worker = models.BooleanField(default=False)
	is_employer = models.BooleanField(default=False)
	is_phone_verified = models.BooleanField(default=False)
	is_id_verified = models.BooleanField(default=False)
	joined_date = models.DateTimeField(default=timezone.now)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)

	objects = UserManager()
	USERNAME_FIELD = 'phone'
	REQUIRED_FIELDS = ['full_name']

	def __str__(self):
		return self.full_name
# User model
