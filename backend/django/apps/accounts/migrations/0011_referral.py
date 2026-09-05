from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):
	dependencies = [
		('accounts', '0010_passwordresetverification'),
		('credits', '0001_initial'),
	]

	operations = [
		migrations.CreateModel(
			name='ReferralCode',
			fields=[
				('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
				('code', models.CharField(max_length=20, unique=True)),
				('created_at', models.DateTimeField(default=django.utils.timezone.now)),
				('owner', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='referral_code_record', to=settings.AUTH_USER_MODEL)),
			],
		),
		migrations.CreateModel(
			name='Referral',
			fields=[
				('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
				('status', models.CharField(choices=[('pending', 'Pending'), ('rewarded', 'Rewarded'), ('rejected', 'Rejected')], default='pending', max_length=20)),
				('referrer_reward', models.PositiveIntegerField(default=5)),
				('referred_reward', models.PositiveIntegerField(default=2)),
				('created_at', models.DateTimeField(default=django.utils.timezone.now)),
				('rewarded_at', models.DateTimeField(blank=True, null=True)),
				('metadata', models.JSONField(blank=True, default=dict)),
				('code', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='referrals', to='accounts.referralcode')),
				('referred', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='referral_record', to=settings.AUTH_USER_MODEL)),
				('referrer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='referrals_made', to=settings.AUTH_USER_MODEL)),
			],
			options={'ordering': ('-created_at', '-id')},
		),
	]
