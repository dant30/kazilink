from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='job_type',
            field=models.CharField(choices=[('weekend_gig', 'Weekend gig'), ('full_time', 'Full time'), ('part_time', 'Part time'), ('daily_shift', 'Daily shift'), ('shift_24hr', '24-hour shift')], max_length=20),
        ),
    ]