from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='notification',
            index=models.Index(fields=['user', 'is_read', '-timestamp'], name='notificatio_user_id_3c0f1d_idx'),
        ),
    ]