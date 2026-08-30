# kazilink.ps1 – corrected
$ErrorActionPreference = "Stop"

# ------------------------------------------------------------
# Helper functions (fixed)
# ------------------------------------------------------------
function New-Directory {
    param([string]$path)
    if (-not $path) { return }
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}

function New-File {
    param([string]$path, [string]$content = "")
    $dir = Split-Path $path
    if ($dir) { New-Directory $dir }
    Set-Content -Path $path -Value $content -Force
}

# ------------------------------------------------------------
# Root
# ------------------------------------------------------------
$root = "kazilink"
New-Directory $root
Set-Location $root

# Root files
New-File "README.md" "# KaziLink`n`nWorker Marketplace App"
New-File ".gitignore" "*.pyc`n__pycache__/`n.env`nnode_modules/`ndist/`n*.log"
New-File ".env.example" "# Environment variables`nSECRET_KEY=change_me`nDEBUG=True"
New-File "docker-compose.yml" "version: '3'`n`nservices:`n  db:`n    image: postgres`n    ..."
New-File "Makefile" "help:`n\t@echo 'Available targets'"

# ------------------------------------------------------------
# Backend
# ------------------------------------------------------------
New-Directory "backend"
New-File "backend/.env" "SECRET_KEY=change_me`nDEBUG=True"
New-File "backend/Dockerfile" "FROM python:3.11`n..."

# core (no matching/verification)
New-Directory "backend/core/services"
New-File "backend/core/services/payment.py" "# Payment helper`ndef process_payment(): pass"
New-Directory "backend/core/exceptions"
New-Directory "backend/core/security"
New-Directory "backend/core/storage"
New-Directory "backend/core/logging"
New-Directory "backend/core/throttling"
New-Directory "backend/core/cache"
New-Directory "backend/core/permissions"
New-Directory "backend/core/authentication"

# django
New-Directory "backend/django"
New-File "backend/django/manage.py" "#!/usr/bin/env python`n...`ndef main(): pass"

New-Directory "backend/django/config"
New-File "backend/django/config/__init__.py" ""
New-Directory "backend/django/config/settings"
New-File "backend/django/config/settings/__init__.py" ""
New-File "backend/django/config/settings/base.py" "# Base settings"
New-File "backend/django/config/settings/development.py" "# Dev settings"
New-File "backend/django/config/settings/production.py" "# Production settings"
New-File "backend/django/config/settings/testing.py" "# Testing settings"
New-File "backend/django/config/urls.py" "# Main URL config"
New-File "backend/django/config/asgi.py" "# ASGI config"
New-File "backend/django/config/wsgi.py" "# WSGI config"
New-File "backend/django/config/celery.py" "# Celery app"

# ------------------------------------------------------------
# Django apps (14 total)
# ------------------------------------------------------------
function New-DjangoApp {
    param($appName)
    New-Directory "backend/django/apps/$appName"
    New-Directory "backend/django/apps/$appName/migrations"
    New-Directory "backend/django/apps/$appName/models"
    New-Directory "backend/django/apps/$appName/serializers"
    New-Directory "backend/django/apps/$appName/services"
    New-Directory "backend/django/apps/$appName/views"
    New-Directory "backend/django/apps/$appName/tests"

    New-File "backend/django/apps/$appName/__init__.py" ""
    New-File "backend/django/apps/$appName/models/__init__.py" ""
    New-File "backend/django/apps/$appName/serializers/__init__.py" ""
    New-File "backend/django/apps/$appName/services/__init__.py" ""
    New-File "backend/django/apps/$appName/views/__init__.py" ""
    New-File "backend/django/apps/$appName/views/api_views.py" "# API views for $appName"
    New-File "backend/django/apps/$appName/views/admin_views.py" "# Admin views"
    New-File "backend/django/apps/$appName/urls.py" "# URL config"
    New-File "backend/django/apps/$appName/tasks.py" "# Celery tasks"
    New-File "backend/django/apps/$appName/permissions.py" "# Permissions"
    New-File "backend/django/apps/$appName/middleware.py" "# Middleware"
    New-File "backend/django/apps/$appName/signals.py" "# Signals"
    New-File "backend/django/apps/$appName/apps.py" "from django.apps import AppConfig`n`nclass ${appName}Config(AppConfig):`n    name = '$appName'"
    New-File "backend/django/apps/$appName/admin.py" "from django.contrib import admin`n`n# Register models"
}

$djangoApps = @(
    "accounts",
    "establishments",
    "jobs",
    "job_applications",
    "employment_history",
    "ratings",
    "messaging",
    "notifications",
    "payments",
    "subscriptions",
    "analytics",
    "support",
    "fraud",
    "audit"
)

foreach ($app in $djangoApps) {
    New-DjangoApp $app
}

# Extra files for specific apps
New-File "backend/django/apps/accounts/models/user.py" "# User model"
New-File "backend/django/apps/accounts/models/profile.py" "# Profile model"
New-File "backend/django/apps/accounts/models/worker.py" "# Worker model"
New-File "backend/django/apps/accounts/models/employer.py" "# Employer model"
New-File "backend/django/apps/accounts/models/verification.py" "# Verification"
New-File "backend/django/apps/accounts/models/role.py" "# Role model"
New-File "backend/django/apps/accounts/services/authentication.py" "# Auth"
New-File "backend/django/apps/accounts/services/registration.py" "# Registration"
New-File "backend/django/apps/accounts/services/verification.py" "# Verification"

New-File "backend/django/apps/jobs/services/job_service.py" "# Job CRUD"
New-File "backend/django/apps/jobs/services/search.py" "# Search"
New-File "backend/django/apps/jobs/services/matching.py" "# Matching (only here)"

New-File "backend/django/apps/employment_history/services/history_service.py" "# History"
New-File "backend/django/apps/employment_history/services/verification.py" "# Employment verification"
New-File "backend/django/apps/employment_history/services/reference_service.py" "# References"

New-File "backend/django/apps/messaging/models.py" "# Conversation, Message, Participant"
New-File "backend/django/apps/messaging/consumers.py" "# WebSocket"
New-File "backend/django/apps/messaging/routing.py" "# WS routing"
New-File "backend/django/apps/messaging/services/messaging.py" "# Messaging logic"

New-File "backend/django/apps/notifications/models.py" "# Notification, NotificationPreference"
New-File "backend/django/apps/notifications/services/notification.py" "# Email, SMS, Push"

New-File "backend/django/apps/payments/services/payment_service.py" "# Payments"
New-File "backend/django/apps/payments/services/mpesa.py" "# M-Pesa"
New-File "backend/django/apps/payments/services/refunds.py" "# Refunds"
New-File "backend/django/apps/payments/webhooks.py" "# Webhooks"

New-File "backend/django/apps/analytics/services/metrics.py" "# KPIs"
New-File "backend/django/apps/analytics/services/reporting.py" "# Reports"
New-File "backend/django/apps/analytics/services/exports.py" "# Exports"

New-File "backend/django/apps/support/services/ticket_service.py" "# Tickets"

New-File "backend/django/apps/fraud/services/detection.py" "# Fraud detection"

New-File "backend/django/apps/audit/models.py" "# AuditLog"

# ------------------------------------------------------------
# Requirements
# ------------------------------------------------------------
New-Directory "backend/django/requirements"
New-File "backend/django/requirements/base.txt" "Django>=4.2`npsycopg2-binary"
New-File "backend/django/requirements/development.txt" "-r base.txt`npytest"
New-File "backend/django/requirements/production.txt" "-r base.txt`ngunicorn"

# ------------------------------------------------------------
# Frontend
# ------------------------------------------------------------
New-Directory "frontend"
New-File "frontend/.env" "VITE_API_URL=http://localhost:8000"
New-File "frontend/index.html" "<!DOCTYPE html><html><head><title>KaziLink</title></head><body><div id='root'></div></body></html>"
New-File "frontend/Dockerfile" "FROM node:18-alpine`n..."

New-Directory "frontend/public"
New-File "frontend/public/offline.html" "<!-- Offline fallback -->"
New-File "frontend/public/service-worker.js" "// Service worker"
New-File "frontend/public/manifest.json" "{}"

New-Directory "frontend/src"
New-File "frontend/src/app.tsx" "import React from 'react'`nexport function App() { return <div>KaziLink</div> }"
New-File "frontend/src/main.tsx" "import React from 'react'`nimport ReactDOM from 'react-dom/client'`nimport { App } from './app'`nReactDOM.createRoot(document.getElementById('root')).render(<App />)"
New-File "frontend/src/index.css" "/* Global styles */"

# core
New-Directory "frontend/src/core/api"
New-Directory "frontend/src/core/contexts"
New-Directory "frontend/src/core/locale"
New-Directory "frontend/src/core/storage"
New-Directory "frontend/src/core/utils"
New-File "frontend/src/core/api/index.ts" "// Axios"
New-File "frontend/src/core/contexts/AuthContext.tsx" "// Auth"
New-File "frontend/src/core/locale/en.json" "{}"
New-File "frontend/src/core/storage/index.ts" "// Storage"
New-File "frontend/src/core/utils/index.ts" "// Utils"

# shared
New-Directory "frontend/src/shared/components/ui"
New-Directory "frontend/src/shared/components/tables"
New-Directory "frontend/src/shared/components/forms"
New-Directory "frontend/src/shared/components/charts"
New-Directory "frontend/src/shared/components/cards"
New-Directory "frontend/src/shared/layouts"
New-File "frontend/src/shared/components/ui/Button.tsx" "// Button"
New-File "frontend/src/shared/components/tables/DataTable.tsx" "// DataTable"
New-File "frontend/src/shared/components/forms/Input.tsx" "// Input"
New-File "frontend/src/shared/components/charts/LineChart.tsx" "// LineChart"
New-File "frontend/src/shared/components/cards/StatCard.tsx" "// StatCard"
New-File "frontend/src/shared/layouts/Sidebar.tsx" "// Sidebar"
New-File "frontend/src/shared/layouts/Header.tsx" "// Header"
New-File "frontend/src/shared/layouts/MainLayout.tsx" "// MainLayout"
New-File "frontend/src/shared/layouts/Footer.tsx" "// Footer"
New-File "frontend/src/shared/layouts/FloatingButton.tsx" "// FloatingButton"

# styles
New-File "frontend/src/styles/animations.css" "/* Animations */"
New-File "frontend/src/styles/variables.css" "/* Variables */"
New-File "frontend/src/styles/global.css" "/* Global */"
New-File "frontend/src/styles/components.css" "/* Component styles */"

# router
New-File "frontend/src/router/public.tsx" "// Public routes"
New-File "frontend/src/router/private.tsx" "// Private routes"
New-File "frontend/src/router/admin.tsx" "// Admin routes"

# ------------------------------------------------------------
# Frontend features (home, admin, etc.)
# ------------------------------------------------------------
function New-Feature {
    param($featureName)
    New-Directory "frontend/src/features/$featureName/pages"
    New-Directory "frontend/src/features/$featureName/services"
    New-Directory "frontend/src/features/$featureName/types"
    New-Directory "frontend/src/features/$featureName/store"
    New-Directory "frontend/src/features/$featureName/hooks"
    New-File "frontend/src/features/$featureName/index.ts" "// $featureName module"
    New-File "frontend/src/features/$featureName/pages/index.ts" "// Pages"
    New-File "frontend/src/features/$featureName/services/index.ts" "// Services"
    New-File "frontend/src/features/$featureName/types/index.ts" "// Types"
    New-File "frontend/src/features/$featureName/store/index.ts" "// Store"
    New-File "frontend/src/features/$featureName/hooks/index.ts" "// Hooks"
}

$features = @(
    "home",
    "auth",
    "accounts",
    "workers",
    "employers",
    "establishments",
    "jobs",
    "job_applications",
    "employment_history",
    "ratings",
    "messaging",
    "notifications",
    "payments",
    "analytics",
    "support",
    "admin"
)

foreach ($feat in $features) {
    New-Feature $feat
}

# Config files
New-File "frontend/package.json" "{ `"name`": `"kazilink-frontend`", `"version`": `"0.1.0`" }"
New-File "frontend/vite.config.ts" "// Vite config"
New-File "frontend/tsconfig.json" "{}"
New-File "frontend/tailwind.config.ts" "// Tailwind"

# ------------------------------------------------------------
# Infrastructure, docs, tests
# ------------------------------------------------------------
New-Directory "infrastructure/nginx"
New-Directory "infrastructure/docker"
New-Directory "infrastructure/scripts"
New-Directory "infrastructure/monitoring"
New-File "infrastructure/nginx/nginx.conf" "# Nginx"
New-File "infrastructure/docker/docker-compose.override.yml" "# Override"
New-File "infrastructure/scripts/deploy.sh" "#!/bin/bash"
New-File "infrastructure/monitoring/prometheus.yml" "# Prometheus"

New-Directory "docs"
New-File "docs/architecture.md" "# Architecture"
New-File "docs/api.md" "# API"
New-File "docs/database.md" "# Database"
New-File "docs/security.md" "# Security"
New-File "docs/deployment.md" "# Deployment"
New-File "docs/business-rules.md" "# Business Rules"

New-Directory "tests/integration"
New-Directory "tests/e2e"
New-Directory "tests/performance"
New-File "tests/integration/test_api.py" "# Integration"
New-File "tests/e2e/test_flow.js" "# E2E"
New-File "tests/performance/locustfile.py" "# Performance"

Write-Host "✅ KaziLink project structure created successfully at $PWD" -ForegroundColor Green