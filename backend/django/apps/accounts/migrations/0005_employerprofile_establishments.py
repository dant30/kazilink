from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_merge_0002_initial_and_worker_availability'),
        ('establishments', '0002_establishment_address_required'),
    ]

    operations = [
        migrations.AddField(
            model_name='employerprofile',
            name='establishments',
            field=models.ManyToManyField(blank=True, related_name='employers', to='establishments.establishment'),
        ),
    ]
