from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
        ('ratings', '0002_review_author_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='author_worker',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reviews_authored', to='accounts.workerprofile'),
        ),
        migrations.AddField(
            model_name='review',
            name='target_employer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reviews_received', to='accounts.employerprofile'),
        ),
        migrations.AlterField(
            model_name='review',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reviews_authored', to='accounts.employerprofile'),
        ),
        migrations.AlterField(
            model_name='review',
            name='target_worker',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='accounts.workerprofile'),
        ),
    ]
