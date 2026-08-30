from django.contrib.postgres.search import SearchQuery, SearchRank
from django.db.models import Q

from ..models import Job


def search_jobs(*, query='', location='', category='', job_type='', status=Job.Status.OPEN, min_pay=None, max_pay=None, featured=None, urgent=None):
	queryset = Job.objects.select_related('employer__user', 'establishment').filter(status=status)
	ordering = ['-is_featured', '-is_urgent', '-posted_date']
	if query:
		search_query = SearchQuery(query, search_type='websearch', config='simple')
		queryset = queryset.filter(
			Q(search_document=search_query)
			| Q(title__icontains=query)
			| Q(description__icontains=query)
		).annotate(search_rank=SearchRank('search_document', search_query))
		ordering.insert(0, '-search_rank')
	if location:
		queryset = queryset.filter(location__iexact=location)
	if category:
		queryset = queryset.filter(category__iexact=category)
	if job_type:
		queryset = queryset.filter(job_type=job_type)
	if min_pay is not None:
		queryset = queryset.filter(pay_amount_ksh__gte=min_pay)
	if max_pay is not None:
		queryset = queryset.filter(pay_amount_ksh__lte=max_pay)
	if featured is not None:
		queryset = queryset.filter(is_featured=featured)
	if urgent is not None:
		queryset = queryset.filter(is_urgent=urgent)
	return queryset.order_by(*ordering)
