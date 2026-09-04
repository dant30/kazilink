from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_workerprofile_profile_fields'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workerprofile',
            name='drivers_license_verified',
        ),
    ]