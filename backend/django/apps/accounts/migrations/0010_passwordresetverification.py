from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

	dependencies = [
		('accounts', '0009_profile_avatars'),
	]

	operations = [
		migrations.CreateModel(
			name='PasswordResetVerification',
			fields=[
				('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
				('code_hash', models.CharField(max_length=128)),
				('expires_at', models.DateTimeField()),
				('attempts', models.PositiveIntegerField(default=0)),
				('verified_at', models.DateTimeField(blank=True, null=True)),
				('reset_token_hash', models.CharField(blank=True, max_length=128)),
				('reset_token_expires_at', models.DateTimeField(blank=True, null=True)),
				('created_at', models.DateTimeField(default=django.utils.timezone.now)),
				('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='password_reset_verifications', to='accounts.user')),
			],
		),
	]