from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = [
		('accounts', '0008_employerprofile_details'),
	]

	operations = [
		migrations.AddField(
			model_name='employerprofile',
			name='avatar',
			field=models.FileField(blank=True, null=True, upload_to='avatars/employers/'),
		),
		migrations.AlterField(
			model_name='workerprofile',
			name='avatar',
			field=models.FileField(blank=True, null=True, upload_to='avatars/workers/'),
		),
	]