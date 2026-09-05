# KaziLink Implementation Plan

This roadmap tracks the current repository state as of 2026-09-05. It separates verified implementation from work that is still incomplete or not yet validated.

## Status Legend

- `✅✅` Implemented in the repository and confirmed by source inspection.
- `❌❌` Missing, incomplete, or not yet verified end to end.

## Phase 0: Foundation And Core Infrastructure

| Deliverable | Status | Current state |
| --- | --- | --- |
| Django settings split into development, production, and testing | ✅✅ | Settings modules exist and base settings are configured. |
| PostgreSQL configuration | ✅✅ | Django is configured for PostgreSQL. |
| Redis configuration | ✅✅ | Redis-backed cache and Channels configuration exist. |
| Celery configuration | ✅✅ | Django Celery app, Redis broker/result settings, task autodiscovery, and worker task modules are configured. |
| Custom phone-login User model | ✅✅ | `accounts.User` uses `phone` as `USERNAME_FIELD`. |
| JWT authentication | ✅✅ | Simple JWT is configured and refresh routing exists. |
| CORS configuration | ✅✅ | `django-cors-headers` is configured. |
| Login and verification throttling | ✅✅ | Core throttling modules are wired into account views. |
| Global RBAC permission package | ❌❌ | App-level permissions exist, but a complete shared `IsWorker`/`IsEmployer`/`IsAdmin` package is not yet established. |
| Cache decorators and utilities | ✅✅ | Core cache modules exist. |
| Docker development stack | ❌❌ | Compose files exist, but the complete stack has not been validated end to end. |

## Phase 1: Identity Layer

| Deliverable | Status | Current state |
| --- | --- | --- |
| User/profile 1:1 relationships | ✅✅ | Worker and employer profiles extend User through one-to-one relationships. |
| Worker and employer registration | ✅✅ | Registration service and role-aware validation exist. |
| Worker profile required fields | ✅✅ | Availability, daily rate, bio, and location are validated and migrated; registration loads expanded occupation and availability catalogs from the backend with searchable selectors. |
| Gulf-market occupation catalog | ✅✅ | Backend catalog includes construction, technical trades, domestic work, caregiving, logistics, security, hospitality, salon, beauty, and driving roles. |
| Phone verification workflow | ✅✅ | OTP generation, hashing, expiry, and verification service exist. |
| User referral codes and rewards | ✅✅ | Users receive unique KAZI codes; attribution and one-time Kazi Credits rewards occur after phone verification. |
| SMS provider integration | ❌❌ | OTP generation exists, but Africa's Talking/Twilio transport is not implemented. |
| Employer business verification | ✅✅ | Model, document field, admin workflow surfaces, and verification-related code exist. |
| S3/local storage production integration | ❌❌ | Storage abstractions exist, but production object-storage integration is not verified. |
| Frontend auth pages | ✅✅ | Login, registration, phone verification, and recovery screens include Kenyan phone normalization, password-strength feedback, role-aware routing, searchable catalogs, referral entry, and separate Terms/Privacy consent. |
| Backend consent records | ✅✅ | Registration requires Terms and Privacy acceptance and stores consent timestamps plus policy versions on the user account. |
| Public privacy policy | ✅✅ | Public `/privacy` page explains collection, use, sharing, retention, rights, cookies, and Kenya Data Protection Act alignment. |
| Frontend worker/employer profile pages | ❌❌ | Feature folders exist, but complete interactive pages are not implemented. |

## Phase 2: Marketplace

| Deliverable | Status | Current state |
| --- | --- | --- |
| Establishment model and employer/job links | ✅✅ | Establishment is normalized and referenced by employers and jobs. |
| Job CRUD and status actions | ✅✅ | Job list/create/detail/close APIs and services exist. |
| Job type and status choices | ✅✅ | Current migrations enforce documented job types and statuses. |
| Application creation and duplicate protection | ✅✅ | Application API and unique job/worker constraint exist; applications require an authenticated worker and consume one Kazi Credit atomically. |
| Application status workflow | ✅✅ | Employer status update flow and notifications exist. |
| Applicant and hire denormalized counters | ✅✅ | Signals maintain job, worker, and employer counters. |
| PostgreSQL full-text search | ✅✅ | Jobs maintain a weighted PostgreSQL search vector and use ranked web-search queries. |
| Location filtering for Nairobi/Mombasa/Kisumu | ✅✅ | Job search supports location filtering through the marketplace query API. |
| Job matching service | ✅✅ | Worker recommendations use indexed skill matching, location scoring, and ranking. |
| Frontend marketplace pages | ✅✅ | Public job discovery/detail pages are available; applying requires an authenticated worker with sufficient Kazi Credits. |

## Phase 3: Employment History And Payments

| Deliverable | Status | Current state |
| --- | --- | --- |
| Employment record schema | ✅✅ | Records include establishment, position, dates, responsibilities, references, and verification fields. |
| History access audit trail | ✅✅ | `HistoryAccessLog` links employer, worker, and payment transaction with a uniqueness constraint. |
| Worker consent enforcement | ✅✅ | Unlock service requires worker consent before access. |
| Employment verification queue | ✅✅ | Verification serializers, views, permissions, and routes exist. |
| Automated reference SMS/email | ❌❌ | Reference data is stored, but outbound verification messaging is not implemented. |
| M-Pesa STK Push initiation | ✅✅ | Configurable Daraja OAuth/STK request code exists. |
| M-Pesa STK Push retry handling | ✅✅ | Bounded retries cover transient provider/network failures without retrying 4xx requests. |
| Kazi Credits wallet and ledger | ✅✅ | User wallets, immutable ledger entries, role-aware catalog pricing, and idempotent spending are implemented. |
| Kazi Credits M-Pesa recharge | ❌❌ | Recharge initiation and native callback settlement code exist, but end-to-end Daraja settlement still needs validation. |
| Native Daraja callback processing | ✅✅ | Native `Body.stkCallback` callbacks settle credit recharges and existing employer transactions idempotently. |
| Signed M-Pesa callback | ❌❌ | Optional custom HMAC validation remains supported, but Daraja does not provide that signature header. |
| Payment/history integration tests | ❌❌ | Credit wallet unit coverage exists; full recharge, callback, and history-unlock integration coverage is still needed. |
| Frontend unlock and checkout UX | ❌❌ | Shared Kazi Credits wallet/recharge UI, employer payment modal, worker application balance gate, and legal consent UX exist; feature-specific history unlock and boost controls remain incomplete. |

## Phase 4: Reputation And Communication

| Deliverable | Status | Current state |
| --- | --- | --- |
| Conversation and message schema | ✅✅ | Participant relationships, direct-chat uniqueness, ordering, and read state exist. |
| Messaging access control | ✅✅ | Messaging requires an application or unlocked history. |
| REST messaging endpoints | ✅✅ | Conversation, message, and read-state routes exist. |
| Real-time Channels/WebSocket chat | ❌❌ | Channels dependencies/configuration exist, but consumers and routing remain incomplete. |
| Review creation after platform hire | ✅✅ | Review service verifies a hired application. |
| Review author snapshots | ✅✅ | Author name, role, and avatar are denormalized. |
| Worker rating/review counters | ✅✅ | Review signals recalculate rating and review count. |
| Two-sided ratings after completed work | ❌❌ | Current model/service supports employer-to-worker reviews only; no job-completion entity or reciprocal flow exists. |
| Frontend inbox and review UI | ❌❌ | Routes/API helpers exist, but complete feature pages are not implemented. |

## Phase 5: Admin, Fraud And Analytics

| Deliverable | Status | Current state |
| --- | --- | --- |
| Custom admin API surfaces | ✅✅ | Admin list/review endpoints exist across major apps. |
| Employment verification administration | ✅✅ | Admin verification queue and actions exist. |
| Fraud alert model and reviewer workflow | ✅✅ | Alert creation, filtering, detail, resolution, permissions, and routes exist. |
| Large-payment fraud detection | ✅✅ | Payment creation signals create high-severity alerts above a configured threshold. |
| Rapid employment-record fraud rule | ❌❌ | The documented five-records-per-day rule is not implemented. |
| Duplicate-job fraud rule | ❌❌ | The documented ten-repeat-job rule is not implemented. |
| KPI snapshot model and generation | ✅✅ | Date-range KPI snapshots and daily generation task exist. |
| Exact business KPI calculations | ❌❌ | Repeat-employer rate and CAC currently default to zero; full business definitions are pending. |
| Frontend admin dashboard | ❌❌ | Admin routes exist, but dashboard screens are still placeholders. |
| Frontend KPI dashboard | ❌❌ | API and route exist, but the feature screen is not implemented. |

## Phase 6: Notifications And Subscriptions

| Deliverable | Status | Current state |
| --- | --- | --- |
| Notification model/preferences/API | ✅✅ | User-scoped notification and preference endpoints exist. |
| Notification signals | ✅✅ | User creation, application, payment, message, and support notifications exist. |
| Push notification/SMS delivery | ❌❌ | Preferences exist, but Firebase/SMS delivery providers are not integrated. |
| Subscription model and lifecycle | ✅✅ | Activation, renewal, cancellation, expiry, and employer synchronization exist. |
| Subscription payment integration | ✅✅ | Completed subscription payments activate subscriptions through signals. |
| Recurring M-Pesa charging | ❌❌ | Initial checkout is implemented; recurring charge scheduling/provider flow is not complete. |
| Billing/invoice frontend | ❌❌ | API routes exist, but billing UI is not implemented. |
| Notification bell frontend | ❌❌ | Header exists, but notification count/actions are not connected to API state. |

## Phase 7: Public Face And Onboarding

| Deliverable | Status | Current state |
| --- | --- | --- |
| Public routes and auth navigation | ✅✅ | Public routes include landing, jobs, job details, terms, privacy, and auth flows; protected actions redirect guests to login with their intended destination. |
| Landing page | ✅✅ | Public landing experience includes backend-fed role search, live jobs, worker profile positioning, trust education, FAQ, calculator, and role-aware calls to action. |
| Worker/employer onboarding funnels | ❌❌ | Registration APIs exist, but role-specific onboarding UI is incomplete. |
| Testimonials and feature presentation | ❌❌ | Not implemented. |

## Phase 8: Testing, Optimization And Deployment

| Deliverable | Status | Current state |
| --- | --- | --- |
| Backend integration tests | ❌❌ | Existing integration/E2E files are placeholders or insufficient for the critical flows. |
| Frontend unit/component tests | ❌❌ | No meaningful frontend test suite is present. |
| Search performance test at 1,000+ concurrent users | ❌❌ | Locust scaffold exists, but the target test is not implemented or verified. |
| Docker/PostgreSQL/Redis/Nginx deployment | ❌❌ | Configuration files exist, but production deployment has not been validated. |
| Daphne/WebSocket production service | ❌❌ | Channels dependency exists; production ASGI/WebSocket deployment is not complete. |
| HTTPS and public callback domain | ❌❌ | Requires deployment infrastructure and a public M-Pesa callback URL. |
| Seed data management command | ❌❌ | `seed_data` has not been implemented. |
| Migration consistency | ✅✅ | Migration conflicts were resolved and migrations apply in the working environment. |
| Runtime validation | ❌❌ | Static diagnostics pass for recent changes, but `manage.py check`, migrations, full test runs, and frontend build still need to be executed in CI/local environments. |

## Current Priorities

1. Finish Channels consumers/routing and real-time messaging.
2. Add the rapid-submission and duplicate-job fraud rules.
3. Add payment/history integration tests and frontend tests.
4. Implement SMS/push delivery, recurring billing, seed data, and deployment validation.

## Validation Commands

```powershell
cd backend/django
python manage.py makemigrations --check
python manage.py check
python manage.py migrate --plan
python manage.py test

cd ../../frontend
npm install
npm run build
```
