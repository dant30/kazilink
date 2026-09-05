from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):
	initial = True
	dependencies = [
		migrations.swappable_dependency(settings.AUTH_USER_MODEL),
	]
	operations = [
		migrations.CreateModel(
			name='CreditWallet',
			fields=[
				('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
				('balance', models.PositiveIntegerField(default=0)),
				('created_at', models.DateTimeField(default=django.utils.timezone.now)),
				('updated_at', models.DateTimeField(auto_now=True)),
				('user', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='credit_wallet', to=settings.AUTH_USER_MODEL)),
			],
		),
		migrations.CreateModel(
			name='CreditRecharge',
			fields=[
				('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
				('amount_ksh', models.PositiveIntegerField()),
				('credits', models.PositiveIntegerField()),
				('phone_number', models.CharField(max_length=20)),
				('status', models.CharField(choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending', max_length=20)),
				('provider', models.CharField(default='mpesa', max_length=30)),
				('provider_reference', models.CharField(blank=True, max_length=100)),
				('metadata', models.JSONField(blank=True, default=dict)),
				('created_at', models.DateTimeField(default=django.utils.timezone.now)),
				('completed_at', models.DateTimeField(blank=True, null=True)),
				('wallet', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='recharges', to='credits.creditwallet')),
			],
		),
		migrations.CreateModel(
			name='CreditLedgerEntry',
			fields=[
				('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
				('entry_type', models.CharField(choices=[('recharge', 'Recharge'), ('spend', 'Spend'), ('refund', 'Refund'), ('promotion', 'Promotion'), ('adjustment', 'Adjustment')], max_length=20)),
				('amount', models.IntegerField()),
				('balance_before', models.PositiveIntegerField()),
				('balance_after', models.PositiveIntegerField()),
				('action', models.CharField(blank=True, max_length=50)),
				('reference', models.CharField(blank=True, max_length=100)),
				('idempotency_key', models.CharField(blank=True, max_length=100)),
				('metadata', models.JSONField(blank=True, default=dict)),
				('created_at', models.DateTimeField(default=django.utils.timezone.now)),
				('wallet', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='ledger_entries', to='credits.creditwallet')),
			],
			options={'ordering': ('-created_at', '-id')},
		),
		migrations.AddConstraint(
			model_name='creditledgerentry',
			constraint=models.UniqueConstraint(condition=~models.Q(idempotency_key=''), fields=('wallet', 'idempotency_key'), name='credits_wallet_idempotency_key_unique'),
		),
	]
