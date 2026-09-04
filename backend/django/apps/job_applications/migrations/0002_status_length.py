from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job_applications', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobapplication',
            name='status',
            field=models.CharField(choices=[('applied', 'Applied'), ('shortlisted', 'Shortlisted'), ('interview_scheduled', 'Interview scheduled'), ('hired', 'Hired'), ('rejected', 'Rejected')], default='applied', max_length=20),
        ),
    ]