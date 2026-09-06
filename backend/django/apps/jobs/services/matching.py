from django.contrib.postgres.search import SearchQuery

from ..models import Job


def match_jobs_for_worker(worker, limit=20):
	if not worker:
		return Job.objects.none()
	worker_skills = {skill.casefold() for skill in worker.skills}
	if limit < 1:
		return []
	search_terms = ' '.join(worker_skills)
	jobs = Job.objects.filter(status=Job.Status.OPEN).select_related('employer__user', 'establishment')
	if search_terms:
		jobs = jobs.filter(search_document=SearchQuery(search_terms, search_type='websearch', config='simple'))
	scored = []
	for job in jobs:
		if worker.years_of_experience < job.minimum_experience_years:
			continue
		job_text = ' '.join([job.category, job.title, *job.requirements, *job.required_skills]).casefold()
		matched_skills = sum(1 for skill in worker_skills if skill in job_text)
		score = matched_skills
		if job.required_skills:
			score += sum(2 for skill in job.required_skills if skill.casefold() in worker_skills)
		score += 1
		if job.location.casefold() == worker.location.casefold():
			score += 2
		if score:
			scored.append((score, job))
	return [job for _, job in sorted(scored, key=lambda item: (item[0], item[1].posted_date), reverse=True)[:limit]]
