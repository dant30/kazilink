from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
	dependencies = [('accounts', '0014_merge_profile_boost_and_consent')]

	operations = [migrations.CreateModel(
		name='IdentityDocument',
		fields=[
			('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
			('document_type', models.CharField(choices=[('national_id', 'National ID'), ('good_conduct', 'Certificate of Good Conduct')], max_length=30)),
			('document', models.FileField(upload_to='identity-verification/')),
			('status', models.CharField(choices=[('pending', 'Pending review'), ('verified', 'Verified'), ('rejected', 'Rejected')], default='pending', max_length=20)),
			('notes', models.TextField(blank=True)),
			('reviewed_at', models.DateTimeField(blank=True, null=True)),
			('created_at', models.DateTimeField(auto_now_add=True)),
			('updated_at', models.DateTimeField(auto_now=True)),
			('reviewed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='identity_documents_reviewed', to='accounts.user')),
			('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='identity_documents', to='accounts.user')),
		],
		options={'ordering': ('-created_at',)},
	)]