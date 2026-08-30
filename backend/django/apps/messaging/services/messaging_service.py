from django.db import transaction
from django.db.models import Q

from apps.accounts.models import EmployerProfile, WorkerProfile
from apps.employment_history.models import HistoryAccessLog
from apps.job_applications.models import JobApplication
from apps.jobs.models import Job

from ..models import Conversation, Message


def can_start_conversation(*, worker, employer, job=None):
    application_filter = Q(worker=worker, job__employer=employer)
    if job is not None:
        application_filter &= Q(job=job)
    return JobApplication.objects.filter(application_filter).exists() or HistoryAccessLog.objects.filter(
        worker=worker, employer=employer
    ).exists()


@transaction.atomic
def get_or_create_conversation(*, worker, employer, job=None):
    if not can_start_conversation(worker=worker, employer=employer, job=job):
        raise PermissionError('Messaging requires a job application or unlocked history access.')
    conversation, _ = Conversation.objects.get_or_create(
        worker=worker, employer=employer, defaults={'job': job}
    )
    if job and conversation.job_id is None:
        conversation.job = job
        conversation.save(update_fields=['job'])
    return conversation


@transaction.atomic
def send_message(*, conversation, sender, text):
    if sender_id := getattr(sender, 'id', None):
        allowed = sender_id in (conversation.worker.user_id, conversation.employer.user_id)
    else:
        allowed = False
    if not allowed:
        raise PermissionError('Only conversation participants can send messages.')
    role = 'worker' if sender.id == conversation.worker.user_id else 'employer'
    message = Message.objects.create(conversation=conversation, sender=sender, sender_role=role, text=text)
    Conversation.objects.filter(pk=conversation.pk).update(last_message=text, last_timestamp=message.timestamp)
    return message


def conversations_for_user(user):
    return Conversation.objects.select_related('worker__user', 'employer__user', 'job').filter(
        Q(worker__user=user) | Q(employer__user=user)
    ).order_by('-last_timestamp')
