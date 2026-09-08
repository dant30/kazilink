from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0014_merge_profile_boost_and_consent'),
        ('employment_history', '0008_alter_employmentrecord_employer'),
    ]

    operations = [
        migrations.AddField(
            model_name='employmentrecord',
            name='employer_verified_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='employmentrecord',
            name='employer_verified_by',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='employmentrecord',
            name='reference_last_attempt_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='employmentrecord',
            name='reference_next_attempt_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='employmentrecord',
            name='reference_verification_attempts',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='employmentrecord',
            name='reference_verification_status',
            field=models.CharField(choices=[('pending', 'Pending'), ('contacted', 'Contacted'), ('verified', 'Verified'), ('failed', 'Failed'), ('rejected', 'Rejected')], default='pending', max_length=20),
        ),
        migrations.AddField(
            model_name='employmentrecord',
            name='reference_verified_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='employmentrecord',
            name='reference_verified_by',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='historyaccesslog',
            name='revocation_reason',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='historyaccesslog',
            name='revoked_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='historyaccesslog',
            name='revoked_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='revoked_history_accesses', to='accounts.user'),
        ),
    ]