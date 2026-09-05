from django.db import migrations, models


class Migration(migrations.Migration):
	dependencies = [('accounts', '0012_expand_worker_availability')]

	operations = [
		migrations.AddField('user', 'terms_accepted_at', models.DateTimeField(blank=True, null=True)),
		migrations.AddField('user', 'privacy_policy_accepted_at', models.DateTimeField(blank=True, null=True)),
		migrations.AddField('user', 'terms_version', models.CharField(blank=True, max_length=20)),
		migrations.AddField('user', 'privacy_policy_version', models.CharField(blank=True, max_length=20)),
	]