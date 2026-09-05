from django.db import migrations, models


class Migration(migrations.Migration):
	dependencies = [
		('accounts', '0011_referral'),
	]

	operations = [
		migrations.AlterField(
			model_name='workerprofile',
			name='availability',
			field=models.CharField(
				choices=[
					('immediate', 'Immediate'),
					('night_shifts', 'Night shifts'),
					('full_time', 'Full time'),
					('part_time', 'Part time'),
					('weekends', 'Weekends'),
					('weekdays', 'Weekdays'),
					('day_shifts', 'Day shifts'),
					('flexible', 'Flexible schedule'),
				],
				max_length=20,
			),
		),
	]
