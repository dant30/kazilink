from django.db import migrations, models


class Migration(migrations.Migration):
	dependencies = [('accounts', '0012_expand_worker_availability')]
	operations = [migrations.AddField(
		model_name='workerprofile', name='profile_boost_until',
		field=models.DateTimeField(blank=True, null=True),
	)]