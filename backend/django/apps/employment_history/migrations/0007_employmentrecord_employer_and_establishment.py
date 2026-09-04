from django.db import migrations, models
import django.db.models.deletion


def set_default_employer_and_establishment(apps, schema_editor):
    EmploymentRecord = apps.get_model('employment_history', 'EmploymentRecord')
    EmployerProfile = apps.get_model('accounts', 'EmployerProfile')
    Establishment = apps.get_model('establishments', 'Establishment')

    for record in EmploymentRecord.objects.all():
        employer = None
        establishment = None

        if record.employer_id:
            employer = EmployerProfile.objects.filter(pk=record.employer_id).first()
        elif record.establishment_id:
            establishment = Establishment.objects.filter(pk=record.establishment_id).first()
            if establishment:
                employer = establishment.employer if hasattr(establishment, 'employer') else None

        if employer is not None:
            record.employer = employer
        if establishment is not None:
            record.establishment = establishment
        record.save(update_fields=['employer', 'establishment'])


class Migration(migrations.Migration):

    dependencies = [
        ('employment_history', '0001_initial'),
        ('accounts', '0005_employerprofile_establishments'),
        ('establishments', '0002_establishment_address_required'),
    ]

    operations = [
        migrations.AddField(
            model_name='employmentrecord',
            name='employer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='employment_records', to='accounts.employerprofile'),
        ),
        migrations.AddField(
            model_name='employmentrecord',
            name='establishment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='employment_records', to='establishments.establishment'),
        ),
        migrations.RunPython(set_default_employer_and_establishment, migrations.RunPython.noop),
    ]
