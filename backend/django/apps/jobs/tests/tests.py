from apps.credits.services import get_or_create_wallet
from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from apps.accounts.models import EmployerProfile, User, WorkerProfile
from apps.credits.services import get_or_create_wallet
from apps.employment_history.models import HistoryAccessLog
from apps.employment_history.services import unlock_history_with_credits

from ..models import Job, SavedJob
from ..services import boost_job_with_credits, feature_job_with_credits


class CreditPromotionTests(TestCase):
	def setUp(self):
		self.employer_user = User.objects.create_user(
			phone='254711000001', full_name='Employer', password='password', is_employer=True,
		)
		self.worker_user = User.objects.create_user(
			phone='254711000002', full_name='Worker', password='password', is_worker=True,
		)
		self.employer = EmployerProfile.objects.create(user=self.employer_user, contact_person='Employer')
		self.worker = WorkerProfile.objects.create(
			user=self.worker_user,
			primary_role='Cook',
			location='Nairobi',
			expected_daily_rate_ksh=1000,
			availability='immediate',
			bio='Experienced cook',
			consent_history_sharing=True,
		)
		self.job = Job.objects.create(
			employer=self.employer,
			title='Cook',
			category='Hospitality',
			location='Nairobi',
			job_type=Job.JobType.FULL_TIME,
			pay_amount_ksh=1000,
			pay_period='day',
			description='Cook needed',
		)

	def give_credits(self, amount):
		wallet = get_or_create_wallet(user=self.employer_user)
		wallet.balance = amount
		wallet.save(update_fields=('balance',))

	def test_feature_and_boost_charge_required_costs_and_set_expiry(self):
		self.give_credits(8)
		featured_job, featured_entry = feature_job_with_credits(
			employer=self.employer, job=self.job, idempotency_key='feature-1',
		)
		boosted_job, boost_entry = boost_job_with_credits(
			employer=self.employer, job=self.job, idempotency_key='boost-1',
		)
		wallet = get_or_create_wallet(user=self.employer_user)
		wallet.refresh_from_db()
		self.assertEqual(wallet.balance, 0)
		self.assertTrue(featured_job.is_featured)
		self.assertGreater(featured_job.featured_until, timezone.now() + timedelta(hours=23))
		self.assertGreater(boosted_job.boost_until, timezone.now() + timedelta(days=6))
		self.assertEqual(featured_entry.amount, -3)
		self.assertEqual(boost_entry.amount, -5)

	def test_promotion_failure_does_not_deduct_credits(self):
		self.give_credits(2)
		with self.assertRaisesMessage(ValueError, 'Insufficient Kazi Credits.'):
			feature_job_with_credits(employer=self.employer, job=self.job, idempotency_key='feature-fail')
		self.job.refresh_from_db()
		wallet = get_or_create_wallet(user=self.employer_user)
		wallet.refresh_from_db()
		self.assertFalse(self.job.is_featured)
		self.assertEqual(wallet.balance, 2)

	def test_history_unlock_charges_one_credit_and_is_audited(self):
		self.give_credits(1)
		access_log, entry = unlock_history_with_credits(
			employer=self.employer, worker=self.worker, idempotency_key='history-1',
		)
		wallet = get_or_create_wallet(user=self.employer_user)
		wallet.refresh_from_db()
		self.assertEqual(access_log.worker_id, self.worker.id)
		self.assertEqual(entry.amount, -1)
		self.assertEqual(wallet.balance, 0)
		self.assertEqual(HistoryAccessLog.objects.count(), 1)

	def test_structured_requirements_and_saved_jobs_are_unique(self):
		self.job.required_skills = ['food_safety', 'customer_service']
		self.job.minimum_experience_years = 2
		self.job.save(update_fields=('required_skills', 'minimum_experience_years'))
		SavedJob.objects.get_or_create(worker=self.worker, job=self.job)
		SavedJob.objects.get_or_create(worker=self.worker, job=self.job)
		self.job.refresh_from_db()
		self.assertEqual(self.job.required_skills, ['food_safety', 'customer_service'])
		self.assertEqual(self.job.minimum_experience_years, 2)
		self.assertEqual(SavedJob.objects.filter(worker=self.worker, job=self.job).count(), 1)