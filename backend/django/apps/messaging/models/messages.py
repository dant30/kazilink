from django.conf import settings
from django.db import models


class Conversation(models.Model):
	worker = models.ForeignKey('accounts.WorkerProfile', on_delete=models.CASCADE, related_name='conversations')
	employer = models.ForeignKey('accounts.EmployerProfile', on_delete=models.CASCADE, related_name='conversations')
	job = models.ForeignKey(
		'jobs.Job', on_delete=models.SET_NULL, null=True, blank=True, related_name='conversations'
	)
	last_message = models.TextField(blank=True)
	last_timestamp = models.DateTimeField(auto_now=True)

	class Meta:
		constraints = [
			models.UniqueConstraint(
				fields=['worker', 'employer'],
				name='unique_worker_employer_conversation',
			)
		]


class Message(models.Model):
	conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
	sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
	sender_role = models.CharField(max_length=20)
	text = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)
	read = models.BooleanField(default=False)

	class Meta:
		ordering = ['timestamp']
