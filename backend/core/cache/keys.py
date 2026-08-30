def job_key(job_id):
    return f'kazilink:job:{job_id}'


def worker_key(worker_id):
    return f'kazilink:worker:{worker_id}'


def search_key(query='', location='', category=''):
    return f'kazilink:jobs:{query}:{location}:{category}'
