from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('establishments', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='establishment',
            name='address',
            field=models.TextField(),
        ),
    ]