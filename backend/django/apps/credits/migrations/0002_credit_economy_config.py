from django.db import migrations, models


class Migration(migrations.Migration):
	dependencies = [('credits', '0001_initial')]
	operations = [migrations.CreateModel(
		name='CreditEconomyConfig',
		fields=[
			('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
			('ksh_per_credit', models.PositiveIntegerField(default=50)),
			('minimum_recharge_ksh', models.PositiveIntegerField(default=100)),
			('referrer_reward_credits', models.PositiveIntegerField(default=5)),
			('referred_reward_credits', models.PositiveIntegerField(default=2)),
			('updated_at', models.DateTimeField(auto_now=True)),
		],
		options={'verbose_name': 'Credit economy configuration', 'verbose_name_plural': 'Credit economy configuration'},
	)]