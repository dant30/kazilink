from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_employerprofile_establishments'),
    ]

    operations = [
        migrations.AddField(
            model_name='workerprofile',
            name='last_employer',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='workerprofile',
            name='background_check_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='workerprofile',
            name='drivers_license_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='workerprofile',
            name='open_to_work',
            field=models.BooleanField(default=True),
        ),
    ]
