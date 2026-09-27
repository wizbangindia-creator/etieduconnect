# ETI EduConnect™ V1 — PRD & Build Record

## Original Problem Statement
Consumer-facing Education Discovery, Comparison & Lead-Generation platform for ETI Learning Systems Pvt Ltd (domain: EtiEduconnect.com). Tagline "Know What's Next." Partner-led model: ETI owns discovery + lead-gen, partner handles enrollment. V1 optimizes for trust, useful comparison, qualified intent and measurable conversion.

## Architecture
- **Frontend:** React 19 + react-router 7 + Tailwind (navy/cyan brand, Poppins/Inter). SPA with public site + admin CMS.
- **Backend:** FastAPI, all routes under `/api`. JWT admin auth (Bearer token in localStorage `eti_admin_token`, also httpOnly cookies).
- **DB:** MongoDB. Collections: universities, courses, guides, landing_pages, leads, events, settings, users. Seeded idempotently on startup.

## User Personas
- 12th-pass student, graduate, working professional, incomplete-graduation user, parent.

## Core Requirements (static)
Discover → Explore → Compare → Shortlist → Get Guidance → Lead → Partner handoff. Trust/disclosure, verified-field dates, standardized comparison fields, UTM/source capture, lead dedup, analytics events, role-based admin, SEO-clean URLs.

## Implemented (2026-01)
- Homepage with hero + global search, study-mode explorer, popular programs, featured universities, comparison banner, courses, guidance CTA, trust disclosure.
- University directory (22 seeded) with filters (mode/program/location/type/sort) + profile pages (recognition, programs, learning/exam, academic process, FAQs, similar).
- Course directory (12 programs) + profile pages (what-it-is, who-suits, eligibility, specializations, curriculum, careers, universities offering, online-vs-distance).
- Comparison engine: universities (2–4 side-by-side standardized table, add/remove picker) and courses.
- Online vs Distance explainer with side-by-side factor table.
- Global search across universities/courses/guides.
- Knowledge Hub: 6 guides (direct answer, key facts, body, caveats, FAQs, related).
- Landing page system (`/lp/:slug`, 6 seeded) with relevant universities + CTA.
- Lead capture: global 2-step LeadModal + full Get Guidance page → `POST /api/leads` (captures UTM/campaign/landing/referrer/context/CTA, dedup by phone/24h, returns ETI ref ID). Consent + no-outcome-promise messaging.
- Shortlist/save (localStorage) with drawer + compare CTAs.
- WhatsApp float CTA (number editable in admin settings).
- Analytics events: search, view_university, view_course, comparison_start/complete, shortlist, lead_submit, whatsapp_click, guidance/partner_handoff.
- Admin CMS (JWT): dashboard (stats, events, leads-by-program, recent leads), leads manager (status/handoff/notes + CSV export), generic CRUD for universities/courses/guides/landing, site settings.
- SEO: branded title/meta/OG tags, clean indexable URLs.

## Verified
Testing agent iteration_1: backend 30/30 pytest pass, frontend 100% — all P0 flows working end-to-end.

## Backlog / Not in V1
- P1 remaining polish: richer per-field source citations in admin, dedicated guide/article WYSIWYG.
- P2 (future): EduConnect AI advisor, career assessment, personalized roadmaps.
- P3: student/parent dashboards, institution marketplace, mobile app.
- Partner handoff currently DB + CSV export + manual status; API/webhook handoff is a future upgrade.

## Notes
- Admin credentials in `/app/memory/test_credentials.md`.
- CORS uses `*` + Bearer token (works); for cross-origin httpOnly cookie flow in production, set explicit FRONTEND origin.
