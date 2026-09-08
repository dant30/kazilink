from django.db import transaction
from django.db.models import Q

from apps.accounts.models import EmployerProfile, WorkerProfile
from apps.credits.services.wallet_service import spend_credits
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


def requires_message_credit(*, worker, employer, user=None):
    if user is None:
        return False
    if not getattr(user, 'is_employer', False):
        return False
    if getattr(user, 'employer_profile', None) is None:
        return False
    return user.employer_profile.id == employer.id and not can_start_conversation(worker=worker, employer=employer)


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
def get_or_create_conversation_for_user(*, worker, employer, user, job=None):
    if user.is_worker:
        return get_or_create_conversation(worker=worker, employer=employer, job=job)

    if not user.is_employer:
        raise PermissionError('Only employer or worker accounts can start conversations.')

    if can_start_conversation(worker=worker, employer=employer, job=job):
        return get_or_create_conversation(worker=worker, employer=employer, job=job)

    spend_credits(
        user=user,
        action='message_worker',
        reference=f'contact-worker:{worker.id}',
        idempotency_key=f'message-worker:{worker.id}:{user.id}:{job.id if job else "direct"}',
    )
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
