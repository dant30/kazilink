from datetime import date, timedelta

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.accounts.models import EmployerProfile, User, WorkerProfile
from apps.employment_history.models import EmploymentRecord, HistoryAccessLog
from apps.establishments.models import Establishment
from apps.job_applications.models import JobApplication
from apps.jobs.models import Job
from apps.ratings.models import Review


ADMIN_PHONE = '0724167076'
WORKER_PHONE = '0724167077'
EMPLOYER_PHONE = '0724167078'


class Command(BaseCommand):
    help = 'Create repeatable demo data for the admin, worker, and employer accounts.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset-demo',
            action='store_true',
            help='Delete records created by this command before recreating them.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        users = self._load_users()
        admin = users['admin']
        worker = users['worker']
        employer = users['employer']

        self._prepare_users(admin, worker, employer)
        employer_profile, _ = EmployerProfile.objects.get_or_create(
            user=employer,
            defaults={
                'business_name': 'Savanna Hospitality Group',
                'location': 'Nairobi',
                'business_type': 'Hospitality group',
                'contact_person': employer.full_name,
                'verified_business': True,
            },
        )
        worker_profile, _ = WorkerProfile.objects.get_or_create(
            user=worker,
            defaults={
                'primary_role': 'Waiter',
                'secondary_roles': ['Bartender', 'Housekeeper'],
                'location': 'Nairobi',
                'years_of_experience': 10,
                'expected_daily_rate_ksh': 1500,
                'expected_monthly_salary_ksh': 45000,
                'availability': WorkerProfile.Availability.IMMEDIATE,
                'bio': 'Experienced hospitality professional focused on warm service and reliable shift support.',
                'skills': ['Customer service', 'Food safety and hygiene', 'Bar service'],
                'languages': ['English', 'Kiswahili', 'Kikuyu'],
                'rating': 4.5,
                'reviews_count': 2,
                'jobs_completed': 2,
                'punctuality_score': 96,
                'response_time_minutes': 18,
                'is_reference_checked': True,
                'consent_history_sharing': True,
                'background_check_verified': True,
                'open_to_work': True,
            },
        )
        self._update_profiles(employer_profile, worker_profile)

        if options['reset_demo']:
            self._reset_demo(employer_profile, worker_profile)

        establishments = self._create_establishments(employer_profile)
        jobs = self._create_jobs(employer_profile, establishments)
        self._create_applications(worker_profile, jobs)
        self._create_employment_history(worker_profile, employer_profile, establishments)
        self._create_reviews(worker_profile, employer_profile, jobs)
        HistoryAccessLog.objects.get_or_create(employer=employer_profile, worker=worker_profile)
        self._update_counters(employer_profile, worker_profile)

        self.stdout.write(self.style.SUCCESS('Demo data is ready.'))
        self.stdout.write(f'Admin: {admin.phone} | Worker: {worker.phone} | Employer: {employer.phone}')
        self.stdout.write(f'Created/updated {len(establishments)} establishments and {len(jobs)} jobs.')
        self.stdout.write('Passwords were not changed.')

    def _load_users(self):
        users = {}
        for key, phone in (('admin', ADMIN_PHONE), ('worker', WORKER_PHONE), ('employer', EMPLOYER_PHONE)):
            try:
                users[key] = User.objects.get(phone=phone)
            except User.DoesNotExist as exc:
                raise CommandError(f'Account not found for {phone}. Create or import the three accounts first.') from exc
        return users

    def _prepare_users(self, admin, worker, employer):
        admin.is_staff = True
        admin.is_superuser = True
        admin.is_active = True
        admin.is_phone_verified = True
        admin.save(update_fields=['is_staff', 'is_superuser', 'is_active', 'is_phone_verified'])

        worker.is_worker = True
        worker.is_employer = False
        worker.is_phone_verified = True
        worker.gender = worker.gender or 'prefer_not_to_say'
        worker.date_of_birth = worker.date_of_birth or date(1993, 3, 5)
        worker.save(update_fields=['is_worker', 'is_employer', 'is_phone_verified', 'gender', 'date_of_birth'])

        employer.is_worker = False
        employer.is_employer = True
        employer.is_phone_verified = True
        employer.gender = employer.gender or 'prefer_not_to_say'
        employer.date_of_birth = employer.date_of_birth or date(1988, 7, 14)
        employer.save(update_fields=['is_worker', 'is_employer', 'is_phone_verified', 'gender', 'date_of_birth'])

    def _update_profiles(self, employer, worker):
        employer.business_name = employer.business_name or 'Savanna Hospitality Group'
        employer.location = employer.location or 'Nairobi'
        employer.business_type = employer.business_type or 'Hospitality group'
        employer.contact_person = employer.contact_person or employer.user.full_name
        employer.verified_business = True
        employer.save(update_fields=['business_name', 'location', 'business_type', 'contact_person', 'verified_business'])

        worker.primary_role = worker.primary_role or 'Waiter'
        worker.secondary_roles = worker.secondary_roles or ['Bartender', 'Housekeeper']
        worker.location = worker.location or 'Nairobi'
        worker.years_of_experience = max(worker.years_of_experience, 10)
        worker.expected_daily_rate_ksh = worker.expected_daily_rate_ksh or 1500
        worker.expected_monthly_salary_ksh = worker.expected_monthly_salary_ksh or 45000
        worker.availability = worker.availability or WorkerProfile.Availability.IMMEDIATE
        worker.bio = worker.bio or 'Experienced hospitality professional focused on warm service and reliable shift support.'
        worker.skills = worker.skills or ['Customer service', 'Food safety and hygiene', 'Bar service']
        worker.languages = worker.languages or ['English', 'Kiswahili', 'Kikuyu']
        worker.rating = worker.rating or 4.5
        worker.jobs_completed = max(worker.jobs_completed, 2)
        worker.punctuality_score = max(worker.punctuality_score, 96)
        worker.response_time_minutes = worker.response_time_minutes or 18
        worker.is_reference_checked = True
        worker.consent_history_sharing = True
        worker.background_check_verified = True
        worker.open_to_work = True
        worker.save()

    def _reset_demo(self, employer, worker):
        Review.objects.filter(job__employer=employer).delete()
        EmploymentRecord.objects.filter(worker=worker).delete()
        HistoryAccessLog.objects.filter(employer=employer, worker=worker).delete()
        JobApplication.objects.filter(worker=worker, job__employer=employer).delete()
        Job.objects.filter(employer=employer, title__startswith='Demo:').delete()
        Establishment.objects.filter(employer=employer, name__startswith='Demo:').delete()

    def _create_establishments(self, employer):
        data = [
            ('Demo: Acacia Rooftop', 'Restaurant', 'Westlands', 'Muthangari Drive, Nairobi'),
            ('Demo: Coastline Suites', 'Hotel', 'Nyali', 'Links Road, Mombasa'),
            ('Demo: Savannah Events', 'Events venue', 'Karen', 'Langata Road, Nairobi'),
        ]
        establishments = []
        for name, kind, location, address in data:
            establishment, _ = Establishment.objects.update_or_create(
                employer=employer,
                name=name,
                defaults={'establishment_type': kind, 'location': location, 'address': address, 'is_verified': True},
            )
            employer.establishments.add(establishment)
            establishments.append(establishment)
        employer.establishment = establishments[0]
        employer.save(update_fields=['establishment'])
        return establishments

    def _create_jobs(self, employer, establishments):
        data = [
            ('Demo: Weekend brunch waiter', 'Waitstaff', establishments[0], 1800, 'daily_shift', True),
            ('Demo: Evening bar service', 'Bartender', establishments[0], 2200, 'weekend_gig', False),
            ('Demo: Hotel breakfast support', 'Waitstaff', establishments[1], 1600, 'daily_shift', False),
            ('Demo: Events floor captain', 'Supervisor', establishments[2], 3000, 'weekend_gig', True),
        ]
        jobs = []
        for title, category, establishment, pay, job_type, urgent in data:
            job, _ = Job.objects.update_or_create(
                employer=employer,
                title=title,
                defaults={
                    'establishment': establishment,
                    'category': category,
                    'location': establishment.location,
                    'job_type': job_type,
                    'pay_amount_ksh': pay,
                    'pay_period': 'per_shift',
                    'shift_times': '7:00 AM - 4:00 PM',
                    'description': f'Demo listing for {title.lower()}. Apply to preview the worker application flow.',
                    'requirements': ['Reliable attendance', 'Professional communication'],
                    'benefits': ['Verified platform record', 'Prompt payment workflow'],
                    'required_skills': ['Customer service'],
                    'minimum_experience_years': 1,
                    'is_urgent': urgent,
                    'is_featured': urgent,
                    'status': Job.Status.OPEN,
                },
            )
            jobs.append(job)
        return jobs

    def _create_applications(self, worker, jobs):
        statuses = [JobApplication.Status.HIRED, JobApplication.Status.SHORTLISTED, JobApplication.Status.INTERVIEW_SCHEDULED, JobApplication.Status.APPLIED]
        for job, status_value in zip(jobs, statuses):
            defaults = {
                'cover_note': f'Demo application for {job.title}. I am ready to support the team with reliable hospitality service.',
                'status': status_value,
                'reviewed_by_employer': status_value != JobApplication.Status.APPLIED,
                'interview_note': 'Demo interview scheduled with the venue manager.' if status_value == JobApplication.Status.INTERVIEW_SCHEDULED else '',
            }
            if status_value == JobApplication.Status.INTERVIEW_SCHEDULED:
                defaults['interview_date'] = timezone.now() + timedelta(days=3)
            JobApplication.objects.update_or_create(job=job, worker=worker, defaults=defaults)

    def _create_employment_history(self, worker, employer, establishments):
        records = [
            ('Demo: Acacia Rooftop', establishments[0], 'Senior Waiter', date(2022, 1, 10), None, True, 'verified'),
            ('Demo: Coastline Suites', establishments[1], 'Breakfast Waiter', date(2020, 5, 1), date(2021, 12, 20), False, 'verified'),
            ('Demo: Savannah Events', establishments[2], 'Events Server', date(2018, 2, 1), date(2019, 11, 30), False, 'pending'),
        ]
        for name, establishment, position, start, end, current, status_value in records:
            EmploymentRecord.objects.update_or_create(
                worker=worker,
                establishment_name=name,
                defaults={
                    'employer': employer,
                    'establishment': establishment,
                    'establishment_type': establishment.establishment_type,
                    'location': establishment.location,
                    'position': position,
                    'start_date': start,
                    'end_date': end,
                    'is_current': current,
                    'responsibilities': ['Serve guests', 'Maintain service standards'],
                    'reference_contact_name': 'Demo Venue Manager',
                    'reference_contact_phone': '+254712345678',
                    'reference_role': 'Operations Manager',
                    'verification_status': status_value,
                    'verified_at': timezone.now() if status_value == 'verified' else None,
                    'verified_by': 'Demo Admin' if status_value == 'verified' else '',
                    'reference_verification_status': 'verified' if status_value == 'verified' else 'pending',
                },
            )

    def _create_reviews(self, worker, employer, jobs):
        Review.objects.update_or_create(
            author=employer,
            target_worker=worker,
            job=jobs[0],
            defaults={
                'author_name': employer.user.full_name,
                'author_role': employer.contact_person,
                'rating': 5,
                'comment': 'Excellent guest service, punctual, and ready to support a busy shift.',
                'role_performed': 'Senior Waiter',
                'establishment_name': jobs[0].establishment.name,
                'is_verified_hire': True,
            },
        )
        Review.objects.update_or_create(
            author_worker=worker,
            target_employer=employer,
            job=jobs[0],
            defaults={
                'author_name': worker.user.full_name,
                'author_role': worker.primary_role,
                'rating': 4,
                'comment': 'Clear shift instructions, respectful communication, and an organized venue team.',
                'role_performed': 'Senior Waiter',
                'establishment_name': jobs[0].establishment.name,
                'is_verified_hire': True,
            },
        )

    def _update_counters(self, employer, worker):
        employer.active_jobs_count = employer.jobs.filter(status=Job.Status.OPEN).count()
        employer.total_hires = JobApplication.objects.filter(job__employer=employer, status=JobApplication.Status.HIRED).count()
        employer.save(update_fields=['active_jobs_count', 'total_hires'])
        worker.jobs_completed = max(worker.jobs_completed, JobApplication.objects.filter(worker=worker, status=JobApplication.Status.HIRED).count())
        worker.reviews_count = Review.objects.filter(target_worker=worker).count()
        worker.save(update_fields=['jobs_completed', 'reviews_count'])
