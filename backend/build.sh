#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
export PYTHONPATH="$PWD/django${PYTHONPATH:+:$PYTHONPATH}"

python -m pip install --upgrade pip
python -m pip install -r django/requirements/production.txt

cd django
if ! find apps -path '*/migrations/0001_initial.py' -print -quit | grep -q .; then
	echo "Deployment error: Django migration files are missing from the repository."
	exit 1
fi
python manage.py check --deploy
python manage.py collectstatic --noinput
