from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_remove_workerprofile_drivers_license'),
    ]

    operations = [
        migrations.AddField(model_name='employerprofile', name='business_name', field=models.CharField(blank=True, max_length=255)),
        migrations.AddField(model_name='employerprofile', name='location', field=models.CharField(blank=True, max_length=100)),
        migrations.AddField(model_name='employerprofile', name='business_type', field=models.CharField(blank=True, max_length=100)),
        migrations.AddField(model_name='employerprofile', name='average_response_time_minutes', field=models.PositiveIntegerField(default=0)),
        migrations.AddField(model_name='employerprofile', name='auto_shortlist', field=models.BooleanField(default=True)),
        migrations.AddField(model_name='employerprofile', name='verified_only', field=models.BooleanField(default=True)),
    ]
