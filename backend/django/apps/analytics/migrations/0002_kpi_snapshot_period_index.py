from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0001_initial'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='kpisnapshot',
            index=models.Index(fields=['-period_end'], name='analytics_period_end_idx'),
        ),
    ]