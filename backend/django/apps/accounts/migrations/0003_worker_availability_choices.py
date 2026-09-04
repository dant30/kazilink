from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_align_profile_fields'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workerprofile',
            name='availability',
            field=models.CharField(choices=[('immediate', 'Immediate'), ('night_shifts', 'Night shifts'), ('full_time', 'Full time'), ('part_time', 'Part time')], max_length=20),
        ),
    ]