from django.contrib.postgres.search import SearchVectorField
from django.db import migrations, models


def populate_search_documents(apps, schema_editor):
    Job = apps.get_model('jobs', 'Job')
    from django.contrib.postgres.search import SearchVector

    Job.objects.update(
        search_document=(
            SearchVector('title', weight='A', config='simple')
            + SearchVector('category', weight='B', config='simple')
            + SearchVector('description', weight='C', config='simple')
        )
    )


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0002_job_type_choices'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='search_document',
            field=SearchVectorField(null=True),
        ),
        migrations.RunPython(populate_search_documents, migrations.RunPython.noop),
        migrations.AddIndex(
            model_name='job',
            index=models.Index(fields=['status', '-posted_date'], name='jobs_status_posted_idx'),
        ),
        migrations.RunSQL(
            sql='CREATE INDEX jobs_search_document_gin_idx ON jobs_job USING GIN (search_document);',
            reverse_sql='DROP INDEX IF EXISTS jobs_search_document_gin_idx;',
        ),
    ]