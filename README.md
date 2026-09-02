# Nikunj Creation — E-commerce Store

A production-shaped e-commerce app for **Nikunj Creation**, a traditional jewellery brand from
Gangakhed, Maharashtra. Rebuilt from the original PHP site into a React storefront with a Node/Express
API, PostgreSQL database and Docker deployment for [Dokploy](https://dokploy.com).

```
frontend/    React 18 + TypeScript + Vite + Tailwind CSS  (served by nginx in production)
backend/     Node 20 + Express + TypeScript + Prisma       (REST API)
legacy-php/  the original PHP site, kept for reference
docker-compose.yml   db + backend + web, ready for Dokploy
```

## What the app does

**Storefront**

- Home page with banner carousel, category rail, bestsellers, new arrivals and reviews
- Catalogue with search, category / price / rating filters, sorting and pagination
- Product detail page with gallery, stock state, quantity picker, delivery info and related items
- Bag (cart) with quantity controls and a live price summary — persisted in the browser
- Checkout with validated delivery address, then UPI (real scannable QR) or cash on delivery
- Orders list, order tracking timeline (Placed → Packed → Shipped → Out for delivery → Delivered)
  and self-service cancellation while an order is still cancellable
- Wishlist, profile editing and password change

**Admin panel** (`/admin`, admin accounts only)

- Dashboard: revenue, orders, products, customers, out-of-stock alerts, orders by status
- Products: add / edit / delete, stock and pricing, feature a piece on the homepage
- Orders: filter by status, expand for items and address, move an order to the next stage
- Customers: who registered and how many orders they placed

**Under the hood**

- JWT auth with bcrypt password hashing and role-based access (`CUSTOMER` / `ADMIN`)
- Order totals, stock checks and stock decrements happen on the server inside a transaction —
  prices are never trusted from the client
- Zod validation on every write endpoint, Helmet + CORS on every request
- Prisma migrations, seeded catalogue of 21 products

## Local development

Requires Node 20+ and a PostgreSQL 14+ database.

```bash
# 1. API
cd backend
cp .env.example .env          # then set DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate deploy     # create the schema
npm run seed                  # 21 products + admin + demo customer
npm run dev                   # http://localhost:4000

# 2. Storefront (second terminal)
cd frontend
npm install
npm run dev                   # http://localhost:5173 (proxies /api to :4000)
```

Or start the whole stack with Docker:

```bash
cp .env.example .env          # set JWT_SECRET and the passwords
docker compose up --build     # storefront on http://localhost:8080
```

### Seeded accounts

| Role     | Email                        | Password   |
| -------- | ---------------------------- | ---------- |
| Admin    | `admin@nikunjcreation.com`   | `Admin@123` |
| Customer | `demo@nikunjcreation.com`    | `Demo@123`  |

Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` before deploying anywhere public.

## Deploying to Dokploy

The repository ships a `docker-compose.yml` with three services — `db` (PostgreSQL with a named
volume), `backend` (API) and `web` (nginx serving the built React app and proxying `/api` to the
backend). One domain is enough: the browser only ever talks to `web`.

1. **Create the application** — in Dokploy, *Project → Create Service → Compose*, then connect this
   Git repository and the branch you deploy from.
2. **Compose path** — leave it as `docker-compose.yml` (repository root).
3. **Environment** — paste the variables from `.env.example` into Dokploy's *Environment* tab:

   ```env
   POSTGRES_USER=nikunj
   POSTGRES_PASSWORD=<strong password>
   POSTGRES_DB=nikunj_creation
   JWT_SECRET=<openssl rand -hex 32>
   CORS_ORIGIN=https://your-domain.com
   ADMIN_EMAIL=you@your-domain.com
   ADMIN_PASSWORD=<strong password>
   SEED_ON_START=true
   WEB_PORT=8080
   ```

4. **Domain** — in the *Domains* tab add your domain, point it at the **`web`** service on
   **port 80**, and enable HTTPS (Let's Encrypt). Dokploy's Traefik terminates TLS in front of it.
5. **Deploy** — Dokploy builds both images and starts the stack. The backend container runs
   `prisma migrate deploy` on every start, so schema changes ship with the code, and seeds the
   catalogue when `SEED_ON_START=true` (upserts — it never duplicates rows).
6. **After the first deploy** — log in as the admin, change the password, and set
   `SEED_ON_START=false` once you manage the catalogue from the admin panel.

**Health checks.** `GET /health` (proxied through the web service) returns `{"status":"ok"}` once
the API can reach the database — use it as Dokploy's health check path.

**Persistence.** The database lives in the `db-data` volume. Keep it across redeploys and back it up
from Dokploy's *Backups* tab (or `pg_dump`) before schema-heavy releases.

**Updating.** Push to the deployment branch and hit *Redeploy* (or enable auto-deploy on push).
The `web` image is rebuilt with the new frontend bundle; the backend applies any new migrations
on boot.

## API reference

| Method | Endpoint                       | Auth     | Purpose                              |
| ------ | ------------------------------ | -------- | ------------------------------------ |
| POST   | `/api/auth/register`           | —        | Create an account                    |
| POST   | `/api/auth/login`              | —        | Log in, returns a JWT                |
| GET    | `/api/auth/me`                 | user     | Current profile                      |
| PUT    | `/api/auth/me`                 | user     | Update name / phone                  |
| PUT    | `/api/auth/me/password`        | user     | Change password                      |
| GET    | `/api/products`                | —        | List with filters, sort, pagination  |
| GET    | `/api/products/categories`     | —        | Categories with counts               |
| GET    | `/api/products/featured`       | —        | Homepage bestsellers                 |
| GET    | `/api/products/:slug`          | —        | One product + related                |
| POST   | `/api/orders`                  | user     | Place an order (server prices it)    |
| GET    | `/api/orders`                  | user     | My orders                            |
| GET    | `/api/orders/:id`              | user     | One order                            |
| POST   | `/api/orders/:id/cancel`       | user     | Cancel and restore stock             |
| GET    | `/api/wishlist`                | user     | Saved products                       |
| POST   | `/api/wishlist`                | user     | Save a product                       |
| DELETE | `/api/wishlist/:productId`     | user     | Remove from wishlist                 |
| GET    | `/api/admin/stats`             | admin    | Dashboard metrics                    |
| GET/POST/PUT/DELETE | `/api/admin/products[/:id]` | admin | Catalogue management         |
| GET    | `/api/admin/orders`            | admin    | All orders, filterable by status     |
| PUT    | `/api/admin/orders/:id/status` | admin    | Move an order along                  |
| GET    | `/api/admin/customers`         | admin    | Registered customers                 |
