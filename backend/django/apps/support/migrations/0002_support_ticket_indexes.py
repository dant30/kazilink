from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('support', '0001_initial'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='supportticket',
            index=models.Index(fields=['user', 'status', '-updated_at'], name='support_use_status_7d1c2a_idx'),
        ),
        migrations.AddIndex(
            model_name='supportticket',
            index=models.Index(fields=['status', '-updated_at'], name='support_status_5a9b3e_idx'),
        ),
    ]