from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fraud', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fraudalert',
            name='detected_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]