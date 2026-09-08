from django.db import migrations, models
import core.utils.validators


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_merge_profile_boost_and_consent'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True, validators=[core.utils.validators.validate_adult_date_of_birth]),
        ),
        migrations.AddField(
            model_name='user',
            name='gender',
            field=models.CharField(blank=True, max_length=30),
        ),
    ]