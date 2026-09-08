from django.test import TestCase

from apps.accounts.models import User, WorkerProfile
from apps.employment_history.models import EmploymentRecord
from apps.employment_history.services import create_record


class EmploymentSubmissionFlowTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            phone='254733000001', full_name='Worker Submitter', password='Password1!', is_worker=True,
        )
        self.worker = WorkerProfile.objects.create(
            user=self.user,
            primary_role='Cook',
            location='Nairobi',
            expected_daily_rate_ksh=1000,
            availability='immediate',
            bio='Experienced cook',
        )

    def test_worker_submission_is_pending_and_has_no_employer(self):
        record = create_record(
            worker=self.worker,
            validated_data={
                'establishment_name': 'Previous Venue',
                'establishment_type': 'Restaurant',
                'location': 'Nairobi',
                'position': 'Cook',
                'start_date': '2022-01-01',
                'end_date': '2023-01-01',
                'is_current': False,
                'responsibilities': [],
                'reference_contact_name': 'Reference Person',
                'reference_contact_phone': '+254733000002',
                'reference_role': 'Manager',
                'employer_id': 99999,
            },
        )
        self.assertEqual(record.verification_status, EmploymentRecord.VerificationStatus.PENDING)
        self.assertIsNone(record.employer_id)
        self.assertEqual(record.reference_verification_status, EmploymentRecord.ReferenceVerificationStatus.PENDING)
