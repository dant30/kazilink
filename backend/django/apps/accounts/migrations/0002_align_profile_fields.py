from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workerprofile',
            name='expected_daily_rate_ksh',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='workerprofile',
            name='bio',
            field=models.TextField(),
        ),
    ]