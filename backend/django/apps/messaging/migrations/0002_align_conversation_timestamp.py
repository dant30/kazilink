from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messaging', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conversation',
            name='last_timestamp',
            field=models.DateTimeField(auto_now=True),
        ),
    ]