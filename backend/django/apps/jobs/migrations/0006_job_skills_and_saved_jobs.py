from django.db import migrations, models
import django.db.models.deletion
from django.contrib.postgres.fields import ArrayField


class Migration(migrations.Migration):
	dependencies = [('jobs', '0005_merge_credit_promotions_and_search')]

	operations = [
		migrations.AddField(
			model_name='job', name='required_skills',
			field=ArrayField(base_field=models.CharField(max_length=100), blank=True, default=list, size=None),
		),
		migrations.AddField(
			model_name='job', name='minimum_experience_years',
			field=models.PositiveIntegerField(default=0),
		),
		migrations.CreateModel(
			name='SavedJob',
			fields=[
				('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
				('created_at', models.DateTimeField(auto_now_add=True)),
				('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_by_workers', to='jobs.job')),
				('worker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_jobs', to='accounts.workerprofile')),
			],
			options={'ordering': ('-created_at',), 'constraints': [models.UniqueConstraint(fields=('worker', 'job'), name='jobs_saved_job_worker_job_unique')]},
		),
	]