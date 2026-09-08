from django.test import TestCase

from apps.accounts.models import EmployerProfile, User, WorkerProfile
from apps.credits.services import get_or_create_wallet
from apps.employment_history.models import EmploymentRecord, HistoryAccessLog
from apps.employment_history.services import record_reference_attempt, revoke_history_access, review_record, unlock_history_with_credits
from apps.notifications.models import Notification


class EmploymentHistoryAccessTests(TestCase):
    def setUp(self):
        self.employer_user = User.objects.create_user(
            phone='254722000001', full_name='Employer User', password='password', is_employer=True,
        )
        self.worker_user = User.objects.create_user(
            phone='254722000002', full_name='Worker User', password='password', is_worker=True,
        )
        self.employer = EmployerProfile.objects.create(user=self.employer_user, contact_person='Employer User')
        self.worker = WorkerProfile.objects.create(
            user=self.worker_user,
            primary_role='Cook',
            location='Nairobi',
            expected_daily_rate_ksh=1000,
            availability='immediate',
            bio='Experienced cook',
            consent_history_sharing=True,
        )
        self.record = EmploymentRecord.objects.create(
            worker=self.worker,
            employer=self.employer,
            establishment_name='Test Venue',
            position='Cook',
            start_date='2024-01-01',
            reference_contact_name='Reference User',
            reference_contact_phone='+254722000003',
        )

    def test_reference_attempts_and_review_notify_worker(self):
        record_reference_attempt(record=self.record, status='contacted', reviewer='Admin')
        self.record.refresh_from_db()
        self.assertEqual(self.record.reference_verification_attempts, 1)
        self.assertEqual(self.record.reference_verification_status, 'contacted')
        review_record(record=self.record, status='verified', reviewer='Admin')
        self.assertTrue(Notification.objects.filter(user=self.worker_user, notification_type='verification').exists())

    def test_revocation_preserves_access_audit_and_blocks_history(self):
        wallet = get_or_create_wallet(user=self.employer_user)
        wallet.balance = 1
        wallet.save(update_fields=('balance',))
        access, _ = unlock_history_with_credits(employer=self.employer, worker=self.worker, idempotency_key='history-audit-1')
        revoke_history_access(worker=self.worker, revoked_by=self.worker_user)
        access.refresh_from_db()
        self.assertIsNotNone(access.revoked_at)
        self.assertFalse(HistoryAccessLog.objects.filter(pk=access.pk, revoked_at__isnull=True).exists())

        self.worker.refresh_from_db()
        self.assertTrue(self.worker.consent_history_sharing)
        self.assertTrue(Notification.objects.filter(user=self.employer_user, notification_type='verification').exists())
