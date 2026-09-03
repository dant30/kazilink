#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
export PYTHONPATH="$PWD/django${PYTHONPATH:+:$PYTHONPATH}"

python -m pip install --upgrade pip
python -m pip install -r django/requirements/production.txt

cd django
python manage.py check --deploy
python manage.py collectstatic --noinput
