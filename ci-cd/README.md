# CI/CD setup for KaziLink

This folder contains a starter CI/CD workflow and deployment helper for the Django backend and React frontend.

## Included files

- `github-actions.yml` — CI pipeline for tests and frontend build
- `deploy.sh` — deployment script for pulling code and rebuilding containers

## Typical usage

1. Add GitHub repository secrets:
   - `DEPLOY_HOST`
   - `DEPLOY_USER`
   - `DEPLOY_KEY`
   - optional: `DEPLOY_PATH`
2. Push to the main branch to trigger CI.
3. Deploy using the script on your server or integrate it into your hosting pipeline.
