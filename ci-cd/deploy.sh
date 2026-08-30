#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Pulling latest changes..."
git pull origin main

echo "Building Docker services..."
docker compose --env-file .env up -d --build

echo "Applying Django migrations..."
docker compose exec -T backend python manage.py migrate

echo "Collecting static files..."
docker compose exec -T backend python manage.py collectstatic --noinput

echo "Deployment complete."
