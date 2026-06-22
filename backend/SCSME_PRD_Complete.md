# SCSME — Product Requirements Document (PRD)

**Stack: ExpressJS + MySQL + TypeORM + Next.js**  
_Selangor Chamber of Small and Medium Entrepreneurs — SME Association Portal_

---

## 1. Overview

| Item         | Detail                                                                        |
| ------------ | ----------------------------------------------------------------------------- |
| Project      | SCSME — Selangor Chamber of Small and Medium Entrepreneurs                    |
| Stack        | ExpressJS (API) · MySQL 8.4 (DB) · TypeORM (ORM) · Next.js (Frontend)         |
| Auth         | JWT + role-based access control (separate `users` & `admins` identity tables) |
| Languages    | Chinese (primary) · English · Bahasa Melayu                                   |
| Monetization | Membership · Events · Resources · Paid Uploads · Ads                          |
| Exclusions   | No lead gen. No referral commission.                                          |

---

## 2. Database Schema

### Tables & Purpose

| Table                 | Purpose                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `users`               | Member-side identity (guest/member/corporate/sponsor). Stores login credentials and role.                 |
| `admins`              | Admin identity, fully separate from `users`. Has `admin_role` (staff/super_admin) and `last_login_at`.    |
| `categories`          | Dynamic company category master data (Technology, Retail, F&B, etc). Managed by admin via dashboard.      |
| `companies`           | Business profile per user. Linked to `categories` via FK. Base for Business Directory and paid uploads.   |
| `membership_plans`    | Master data for membership packages (Basic/Standard/Corporate) — price, duration, benefits.               |
| `subscriptions`       | Active/historical subscription per user. Source of truth for checking active membership status.           |
| `events`              | Event/training master data (title, date, location, price, capacity, publish status).                      |
| `event_registrations` | User event registration record. Stores ticket type, payment status, QR code, attendance, certificate URL. |
| `resources`           | Resource catalog (article/template/replay/course) with access levels (public/member/paid).                |
| `resource_purchases`  | Tracks paid resource access. Used to verify download rights for `access_level = paid`.                    |
| `paid_uploads`        | Core ad monetization table. All sponsored content types with full status flow and SEO fields.             |
| `ad_placements`       | Execution/placement of approved paid_uploads. Tracks impressions, clicks, schedule, and expiry.           |
| `payments`            | Polymorphic payment log across all modules via `order_type` + `order_id`. Stores proof and invoice URLs.  |
| `admin_logs`          | Audit trail for all admin actions. FK to `admins` (not users) for accountability.                         |

### Key Schema Notes

- All primary keys are `char(36)` UUID — generated at application layer
- `categories` table uses `utf8mb4_0900_ai_ci` collation (MySQL 8.4 default); `companies.category_id` matches this collation
- All other tables use `utf8mb4_unicode_ci`
- `payments.order_id` is polymorphic — no DB-level FK, integrity enforced at application layer
- `users.role` is a fixed enum — not dynamic, because role drives hardcoded guard logic

---

## 3. User & Admin Roles

### Member-side roles (`users` table)

| Role        | Access                                              |
| ----------- | --------------------------------------------------- |
| `guest`     | Public pages, read-only. Assigned on registration.  |
| `member`    | Profile, events (free), member-tier resources       |
| `corporate` | All member access + team seats + higher ad exposure |
| `sponsor`   | Paid upload center access                           |

> Role is upgraded automatically when subscription is activated (Basic → `member`, Corporate → `corporate`). Role is downgraded to `guest` when subscription expires (via cron job).

### Admin-side roles (`admins` table — fully separate)

| Role          | Access                                                           |
| ------------- | ---------------------------------------------------------------- |
| `staff`       | Dashboard modules per assigned permissions                       |
| `super_admin` | Full dashboard, all approvals/rejections, staff admin management |

> Admin accounts are completely separate from `users`. Admins have no member profiles, subscriptions, or paid uploads. Admin auth uses its own endpoint, JWT payload (`actor_type: 'admin'`), and role guard.

---

## 4. Access Control

### Plan-based Access (Subscription Guard)

Access to resources and features is determined by the user's **active subscription plan**, not just their role.

```
Plan Hierarchy: Basic (level 1) < Standard (level 2) < Corporate (level 3)
```

| Feature                          | Guest | Basic | Standard | Corporate |
| -------------------------------- | ----- | ----- | -------- | --------- |
| Public resources                 | ✅    | ✅    | ✅       | ✅        |
| Member-tier resources            | ❌    | ✅    | ✅       | ✅        |
| Event registration (free events) | ❌    | ✅    | ✅       | ✅        |
| Event discounts                  | ❌    | ❌    | ✅       | ✅        |
| Full resource access             | ❌    | ❌    | ❌       | ✅        |
| Ad exposure boost                | ❌    | ❌    | ❌       | ✅        |

**Guard logic:** On each protected request, the API queries `subscriptions JOIN membership_plans` for the user's active plan (`renewal_status = active`, `payment_status = paid`, `end_date >= TODAY`). Result is cached in Redis (TTL: 1 hour).

---

## 5. Pages & Modules

### 5.1 Public Website (Next.js)

| Page                    | Route                           | Key Sections                                        |
| ----------------------- | ------------------------------- | --------------------------------------------------- |
| Home                    | `/`                             | Hero, core services, upcoming events, join CTA      |
| About                   | `/about`                        | Mission, vision, who should join                    |
| Membership              | `/membership`                   | Plan cards, benefits table, join CTA                |
| Events & Training       | `/events`                       | Event list, filters, event detail, ticket purchase  |
| Resources Center        | `/resources`                    | Free/paid/member-only downloads                     |
| Sponsor & Paid Exposure | `/sponsor`                      | Pricing, upload form, package selection             |
| Business Directory      | `/directory`                    | Search, category filter (dynamic), featured listing |
| Contact                 | `/contact`                      | Form, WhatsApp link                                 |
| Login / Register        | `/auth/login`, `/auth/register` | JWT auth (member-side only)                         |

### 5.2 Member Portal (Next.js — protected routes)

| Module             | Route                   | Function                                           |
| ------------------ | ----------------------- | -------------------------------------------------- |
| Dashboard          | `/dashboard`            | Overview: subscription status, events, uploads     |
| Profile            | `/dashboard/profile`    | Edit company profile, upload logo, select category |
| My Events          | `/dashboard/events`     | Registered events, QR code display, certificate DL |
| My Resources       | `/dashboard/resources`  | Free downloads, purchased replay access            |
| Paid Upload Center | `/dashboard/uploads`    | Submit banner/brand/product/article/push/featured  |
| My Subscription    | `/dashboard/membership` | Current plan, renewal status, upgrade option       |

### 5.3 Admin Dashboard (Next.js — admin auth only)

| Module                        | Route                  | Access           |
| ----------------------------- | ---------------------- | ---------------- |
| Admin Login                   | `/admin/login`         | Public           |
| Revenue Overview / Dashboard  | `/admin`               | staff + super    |
| Members Management            | `/admin/members`       | staff + super    |
| Subscriptions                 | `/admin/subscriptions` | staff + super    |
| Events Management             | `/admin/events`        | staff + super    |
| Paid Uploads Approval Queue   | `/admin/uploads`       | staff + super    |
| Ad Placements & Performance   | `/admin/placements`    | staff + super    |
| Resources Management          | `/admin/resources`     | staff + super    |
| Categories Management         | `/admin/categories`    | staff + super    |
| Payments & Proof Verification | `/admin/payments`      | staff + super    |
| Expiry & Renewal Monitor      | `/admin/expiry`        | staff + super    |
| Audit Logs                    | `/admin/logs`          | staff + super    |
| Staff Admin Management        | `/admin/staff`         | super_admin only |

---

## 6. API Endpoints (ExpressJS)

# SCSME APP — API Endpoints

**Base URL:** `http://localhost:5000`

**Auth Header:** `Authorization: Bearer <token>`

| Label     | Description                             |
| --------- | --------------------------------------- |
| `—`       | No authentication required              |
| `[auth]`  | Requires Bearer token (user or admin)   |
| `[admin]` | Requires admin token + admin/staff role |

---

## Admin `/admin`

| Method | Endpoint                   | Auth    |
| ------ | -------------------------- | ------- |
| GET    | `/admin/`                  | —       |
| GET    | `/admin/:id`               | [auth]  |
| GET    | `/admin/email?email=`      | [auth]  |
| POST   | `/admin/login`             | —       |
| POST   | `/admin/create`            | —       |
| POST   | `/admin/logout`            | [auth]  |
| PUT    | `/admin/update/:id`        | [admin] |
| DELETE | `/admin/delete/:id`        | [admin] |
| GET    | `/admin/users`             | [admin] |
| GET    | `/admin/user/email?email=` | [admin] |
| GET    | `/admin/user/search?name=` | [admin] |
| DELETE | `/admin/user/:id`          | [admin] |

---

## User `/user`

| Method | Endpoint           | Auth   |
| ------ | ------------------ | ------ |
| POST   | `/user/register`   | —      |
| POST   | `/user/login`      | —      |
| POST   | `/user/logout`     | —      |
| GET    | `/user/get/:id`    | [auth] |
| PUT    | `/user/update/:id` | [auth] |

---

## Category `/category`

| Method | Endpoint               | Auth    |
| ------ | ---------------------- | ------- |
| GET    | `/category/`           | —       |
| GET    | `/category/:id`        | [auth]  |
| POST   | `/category/create`     | [admin] |
| PUT    | `/category/update/:id` | [admin] |
| DELETE | `/category/delete/:id` | [admin] |

---

## Company `/company`

| Method | Endpoint                | Auth   |
| ------ | ----------------------- | ------ |
| GET    | `/company/`             | —      |
| GET    | `/company/search?name=` | [auth] |
| GET    | `/company/:id`          | [auth] |
| POST   | `/company/create`       | [auth] |
| PUT    | `/company/update/:id`   | [auth] |
| DELETE | `/company/delete/:id`   | [auth] |

---

## Company Verify `/company-verify`

| Method | Endpoint                     | Auth    |
| ------ | ---------------------------- | ------- |
| GET    | `/company-verify/`           | —       |
| GET    | `/company-verify/:id`        | [admin] |
| PATCH  | `/company-verify/status/:id` | [admin] |
| DELETE | `/company-verify/delete/:id` | [admin] |

---

## Event `/event`

| Method | Endpoint            | Auth    |
| ------ | ------------------- | ------- |
| GET    | `/event/`           | —       |
| GET    | `/event/:id`        | [auth]  |
| POST   | `/event/create`     | [admin] |
| PUT    | `/event/update/:id` | [admin] |
| DELETE | `/event/delete/:id` | [admin] |

---

## Event Registration `/event-registration`

| Method | Endpoint                         | Auth    |
| ------ | -------------------------------- | ------- |
| GET    | `/event-registration/`           | —       |
| GET    | `/event-registration/:id`        | [auth]  |
| GET    | `/event-registration/qrcode/:id` | [auth]  |
| POST   | `/event-registration/create`     | [auth]  |
| DELETE | `/event-registration/delete/:id` | [auth]  |
| PATCH  | `/event-registration/verify/:id` | [admin] |

---

## Membership Plans `/membership-plans`

| Method | Endpoint                         | Auth    |
| ------ | -------------------------------- | ------- |
| GET    | `/membership-plans/`             | —       |
| GET    | `/membership-plans/get/:id`      | [admin] |
| POST   | `/membership-plans/create`       | [admin] |
| PUT    | `/membership-plans/update/:id`   | [admin] |
| PATCH  | `/membership-plans/isActive/:id` | [admin] |
| DELETE | `/membership-plans/delete/:id`   | [admin] |

---

## Subscription `/subscription`

| Method | Endpoint                    | Auth    |
| ------ | --------------------------- | ------- |
| GET    | `/subscription/`            | —       |
| GET    | `/subscription/:id`         | [auth]  |
| POST   | `/subscription/create`      | [auth]  |
| PUT    | `/subscription/upgrade/:id` | [auth]  |
| DELETE | `/subscription/delete/:id`  | [auth]  |
| PATCH  | `/subscription/verify/:id`  | [admin] |

---

## Payment `/payment`

| Method | Endpoint              | Auth   |
| ------ | --------------------- | ------ |
| GET    | `/payment/`           | —      |
| GET    | `/payment/:id`        | [auth] |
| POST   | `/payment/create`     | [auth] |
| DELETE | `/payment/delete/:id` | [auth] |

> `POST /payment/create` → `multipart/form-data`, field file: `proofUrl`

---

## Payment Admin Verify `/payment-admin-verify`

| Method | Endpoint                           | Auth    |
| ------ | ---------------------------------- | ------- |
| GET    | `/payment-admin-verify/`           | —       |
| GET    | `/payment-admin-verify/pending`    | [admin] |
| GET    | `/payment-admin-verify/:id`        | [admin] |
| PATCH  | `/payment-admin-verify/verify/:id` | [admin] |
| DELETE | `/payment-admin-verify/delete/:id` | [admin] |

---

## Resources (Admin) `/resources`

| Method | Endpoint                  | Auth    |
| ------ | ------------------------- | ------- |
| GET    | `/resources/`             | —       |
| GET    | `/resources/type/:type`   | [admin] |
| GET    | `/resources/:id`          | [admin] |
| GET    | `/resources/download/:id` | [admin] |
| POST   | `/resources/create`       | [admin] |
| PUT    | `/resources/update/:id`   | [admin] |
| DELETE | `/resources/delete/:id`   | [admin] |

> `POST/PUT` → `multipart/form-data`, field file: `fileUrl`, `coverImage`

---

## Resources (User) `/user-resources`

| Method | Endpoint                       | Auth               |
| ------ | ------------------------------ | ------------------ |
| GET    | `/user-resources/`             | — (optional login) |
| GET    | `/user-resources/isActive`     | [auth]             |
| GET    | `/user-resources/download/:id` | [auth]             |

---

## Resource Purchases `/resource-purchases`

| Method | Endpoint                         | Auth    |
| ------ | -------------------------------- | ------- |
| POST   | `/resource-purchases/create/:id` | [auth]  |
| DELETE | `/resource-purchases/delete/:id` | [auth]  |
| GET    | `/resource-purchases/`           | [admin] |
| GET    | `/resource-purchases/:id`        | [admin] |
| PATCH  | `/resource-purchases/verify/:id` | [admin] |

---

## Paid Uploads (User) `/paid-uploads`

| Method | Endpoint                   | Auth   |
| ------ | -------------------------- | ------ |
| POST   | `/paid-uploads/create`     | [auth] |
| GET    | `/paid-uploads/:id`        | [auth] |
| PUT    | `/paid-uploads/update/:id` | [auth] |
| DELETE | `/paid-uploads/delete/:id` | [auth] |

> `POST/PUT` → `multipart/form-data`, field file: `imageUrl`

---

## Paid Uploads (Admin) `/paid-uploads-admin`

| Method | Endpoint                             | Auth    |
| ------ | ------------------------------------ | ------- |
| GET    | `/paid-uploads-admin/`               | —       |
| GET    | `/paid-uploads-admin/status?status=` | [admin] |
| PATCH  | `/paid-uploads-admin/approve/:id`    | [admin] |
| PATCH  | `/paid-uploads-admin/rejected/:id`   | [admin] |
| PATCH  | `/paid-uploads-admin/revision/:id`   | [admin] |

---

## 7. Paid Upload Status Flow

```
Draft
  └─► Pending Payment   (user submits)
        └─► Pending Review   (payment confirmed)
              ├─► Revision Required   (admin requests changes)
              │     └─► Pending Review   (user resubmits)
              ├─► Rejected   (admin rejects + refund if needed)
              └─► Scheduled   (approved, start_date > today)
                    └─► Published   (cron publishes at start_date or immediately)
                          └─► Expired   (cron expires at end_date)
```

**Rules:**

- No upload goes to `published` without `payment_status = paid` + admin approval
- Admin free override → must log reason in `admin_logs` (FK to `admins.id`)
- 7 days before `end_date` → send renewal reminder (cron job)
- At `end_date` → cron auto-sets status to `expired`, unpublishes `ad_placement`

---

## 8. Cron Jobs (Daily at 00:00)

| Job                       | Query                                          | Action                                                                              |
| ------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| Expire subscriptions      | `end_date < today AND renewal_status = active` | Set `renewal_status = expired`, downgrade `users.role` to `guest`, send email       |
| Expire paid uploads       | `end_date < today AND status = published`      | Set `status = expired`, update `ad_placements`                                      |
| Renewal reminder          | `end_date = today + 7`                         | Send email + push notification with renewal link                                    |
| Publish scheduled uploads | `start_date = today AND status = scheduled`    | Set `status = published`, create/update `ad_placements`, set `published_at = NOW()` |

---

## 9. Monetization Summary

| Item                 | Charge Logic                                                |
| -------------------- | ----------------------------------------------------------- |
| Membership           | RM0 (Basic) / RM300 (Standard) / RM800 (Corporate) per year |
| Event ticket         | Per event, per ticket type (standard/VIP)                   |
| Resource download    | Per item (paid resources only)                              |
| Homepage banner      | By placement + duration (7/14/30 days)                      |
| Brand profile        | By duration (30/90/365 days)                                |
| Product/service card | Per listing or bundle                                       |
| Sponsored article    | Per article or campaign                                     |
| Push notification    | Per send / per segment                                      |
| Featured directory   | By days + category                                          |
| Event sponsor slot   | Per event                                                   |
| Training sponsor     | Per training/workshop                                       |
| Resource sponsor     | Per resource item                                           |

---

## 10. Backend Development Order

### Phase 1 — Core Foundation

```
1. Category CRUD (admin)
2. Membership Plans CRUD (admin)
```

### Phase 2 — Membership Flow

```
3. Subscription + Payment (membership)
4. Admin Approval for Membership Payment
   └─ On approve: activate subscription, upgrade user role
```

### Phase 3 — Company Profile

```
5. Company CRUD (user) — depends on categories
6. Admin Company Verification
```

### Phase 4 — Events Flow

```
7. Events CRUD (public + admin)
8. Event Registration + Payment
9. QR Code generation + Attendance check-in
10. Certificate generation (post-event)
```

### Phase 5 — Resources Flow

```
11. Resources CRUD (public + admin)
12. Plan-based access guard (queries active subscription)
13. Resource Purchase + Payment
14. Download access check
```

### Phase 6 — Paid Upload Flow

```
15. Paid Upload draft/submit/pay (user)
16. Admin Review queue (approve/reject/revision)
17. Ad Placement creation on approval
18. Impression/click tracking endpoints
```

### Phase 7 — Cron Jobs

```
19. Expire subscriptions + downgrade role
20. Expire paid uploads + unpublish ad placements
21. Renewal reminders (email)
22. Auto-publish scheduled uploads
```

### Phase 8 — Admin Supporting

```
23. Admin dashboard stats
24. Revenue report by category
25. Audit logs viewer
26. Staff admin management (super_admin only)
```

---

## 11. Project Folder Structure

```
scsme/
├── backend/                         # ExpressJS API
│   ├── src/
│   │   ├── entities/                # TypeORM entity classes
│   │   │   ├── base.ts              # BaseEntity (uuid PK, updatedAt)
│   │   │   ├── user.entity.ts
│   │   │   ├── admin.entity.ts
│   │   │   ├── category.entity.ts   # NEW
│   │   │   ├── company.entity.ts    # category_id FK (replaces category varchar)
│   │   │   ├── membership-plan.entity.ts
│   │   │   ├── subscription.entity.ts
│   │   │   ├── event.entity.ts
│   │   │   ├── event-registration.entity.ts
│   │   │   ├── resource.entity.ts
│   │   │   ├── resource-purchase.entity.ts
│   │   │   ├── paid-upload.entity.ts
│   │   │   ├── ad-placement.entity.ts
│   │   │   ├── payment.entity.ts
│   │   │   ├── admin-log.entity.ts
│   │   │   └── index.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── admin-auth.routes.ts
│   │   │   ├── category.routes.ts
│   │   │   ├── company.routes.ts
│   │   │   ├── membership.routes.ts
│   │   │   ├── event.routes.ts
│   │   │   ├── resource.routes.ts
│   │   │   ├── upload.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   ├── placement.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── admin-auth.controller.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── company.controller.ts
│   │   │   ├── membership.controller.ts
│   │   │   ├── event.controller.ts
│   │   │   ├── resource.controller.ts
│   │   │   ├── upload.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── placement.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts        # member JWT (actor_type: 'user')
│   │   │   ├── admin-auth.middleware.ts  # admin JWT (actor_type: 'admin')
│   │   │   ├── admin-guard.middleware.ts # staff vs super_admin check
│   │   │   └── plan-access.middleware.ts # subscription plan level check
│   │   ├── services/
│   │   │   ├── subscription.service.ts  # getActivePlan() with Redis cache
│   │   │   ├── payment.service.ts
│   │   │   ├── qr.service.ts
│   │   │   ├── certificate.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── upload.service.ts        # file storage handler
│   │   ├── jobs/
│   │   │   ├── expire-subscriptions.job.ts
│   │   │   ├── expire-uploads.job.ts
│   │   │   ├── renewal-reminder.job.ts
│   │   │   └── publish-scheduled.job.ts
│   │   └── app.ts
│   ├── ormconfig.ts
│   └── package.json
│
├── frontend/                        # Next.js
│   ├── app/
│   │   ├── (public)/                # Home, About, Membership, Events, Resources...
│   │   ├── dashboard/               # Member portal (protected)
│   │   └── admin/                   # Admin dashboard (admin auth only)
│   ├── components/
│   │   ├── ui/                      # Button, Card, Badge, Modal...
│   │   ├── layout/                  # Nav, Footer, Sidebar
│   │   └── modules/                 # EventCard, UploadForm, PlanCard...
│   ├── lib/
│   │   ├── api.ts                   # Axios/fetch wrapper
│   │   └── i18n/                    # zh / en / ms translation JSONs
│   └── package.json
│
└── README.md
```

---

## 12. Entity Notes (TypeORM)

### Key corrections from initial schema:

| Entity        | Change                                                                                  |
| ------------- | --------------------------------------------------------------------------------------- |
| `BaseEntity`  | Remove `@CreateDateColumn` — each entity declares `createdAt` independently             |
| `Category`    | New entity — `id`, `name`, `slug`                                                       |
| `Company`     | `category` (varchar) → `categoryId` (FK to categories); fix `verificationStatus` naming |
| `PaidUpload`  | Fix `upload_type` → `uploadType`                                                        |
| `AdPlacement` | Fix `paidUpload_id` → `paidUploadId`                                                    |
| All entities  | Add `@CreateDateColumn({ name: 'created_at' })` where missing                           |

### Collation warning:

`categories` table is `utf8mb4_0900_ai_ci` (MySQL 8.4 default). `companies.category_id` must match this collation or FK creation will fail with `#3780`.

---

## 13. SEO / AEO Checklist

- [ ] Every image: lowercase-hyphenated filename, `alt_text` in 3 languages
- [ ] Every page: `<title>`, `<meta description>`, OG tags
- [ ] Home + About: `Organization` schema (JSON-LD)
- [ ] Event detail: `Event` schema (JSON-LD)
- [ ] Membership + Sponsor + Contact: `FAQ` schema (JSON-LD)
- [ ] Paid uploads must collect `seo_title`, `meta_description`, `alt_text` before submit

---

## 14. Key Constraints

1. **No lead gen module** — zero commission, zero referral tracking
2. **No publish without payment** — `payment_status = paid` enforced in API middleware and admin UI before any approval
3. **Admin free override** must write to `admin_logs` with reason (FK to `admins.id`, never `users.id`)
4. **i18n** — all UI strings from translation files (zh/en/ms), never hardcoded
5. **Mobile-first** — buttons minimum 44px touch target, all forms mobile-friendly
6. **Admin identity fully separate from member identity** — `admins` table is independent of `users`. No cross-contamination between member roles and admin roles.
7. **Polymorphic payments** — `payments.order_id` has no DB-level FK. Integrity enforced at application layer via `order_type` switch.
8. **Dynamic categories** — company categories are managed by admin via dashboard, not hardcoded enum. Stored in `categories` table, linked to `companies` via `category_id` FK.
9. **Plan access guard** — queries `subscriptions JOIN membership_plans` per request. Cache active plan in Redis (TTL: 1 hour) to avoid repeated DB hits.
