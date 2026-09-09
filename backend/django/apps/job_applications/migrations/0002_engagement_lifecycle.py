from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job_applications', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobapplication',
            name='engagement_ended_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='jobapplication',
            name='engagement_note',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='jobapplication',
            name='engagement_status',
            field=models.CharField(choices=[('active', 'Active'), ('completed', 'Completed'), ('worker_quit', 'Worker quit'), ('employer_terminated', 'Employer terminated')], default='active', max_length=30),
        ),
    ]
