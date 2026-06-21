# SCSME APP — API Endpoints

**Base URL:** `http://localhost:5000`

**Auth Header:** `Authorization: Bearer <token>`

| Label     | Description                          |
| --------- | ------------------------------------ |
| `—`       | No authentication required           |
| `[auth]`  | Requires Bearer token (user or admin)|
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

| Method | Endpoint                       | Auth        |
| ------ | ------------------------------ | ----------- |
| GET    | `/user-resources/`             | — (optional login) |
| GET    | `/user-resources/isActive`     | [auth]      |
| GET    | `/user-resources/download/:id` | [auth]      |

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
