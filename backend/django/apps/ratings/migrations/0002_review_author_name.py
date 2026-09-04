from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ratings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='author_name',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]