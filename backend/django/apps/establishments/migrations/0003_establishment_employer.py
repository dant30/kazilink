import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('establishments', '0002_establishment_address_required'),
        ('accounts', '0005_employerprofile_establishments'),
    ]

    operations = [
        migrations.AddField(
            model_name='establishment',
            name='employer',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='owned_establishments',
                to='accounts.employerprofile',
            ),
        ),
    ]
