# TrustSilcon — Premium E-Commerce Website

A complete premium e-commerce platform for **TrustSilcon**, a body-safe silicone wellness brand. Built with Next.js App Router, MongoDB, Cloudinary, Shiprocket, and Nodemailer.

## Features

### Customer Store
- Premium light-blue wellness-themed UI (Meta ads friendly)
- 14 pages: Home, Shop, Product Detail, Cart, Checkout, Order Success, Track Order, Reviews, About, Contact, and 4 policy pages
- localStorage cart, coupon codes, search & filters
- Related products, recently viewed, low stock & bestseller badges
- WhatsApp support button, SEO metadata, sitemap, robots.txt

### Admin Panel (`/admin/login`)
- JWT cookie authentication
- Dashboard with order/revenue stats
- Product CRUD with Cloudinary image upload
- Order management with Shiprocket integration
- Review approval, contact leads, coupons, email subscribers

### Integrations
- **MongoDB Atlas** — all data storage
- **Cloudinary** — permanent product image hosting
- **Shiprocket** — order creation, AWB assignment, tracking webhooks
- **Nodemailer** — transactional & marketing emails with unsubscribe system
- **Vercel Cron** — 15-day marketing email reminders

## Tech Stack

- Next.js 16 (App Router)
- JavaScript (no TypeScript)
- Tailwind CSS v4
- MongoDB + Mongoose
- JWT (jose) admin auth
- Cloudinary, Nodemailer, Shiprocket API

## Quick Start

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — random secret for admin JWT
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin login credentials
- `CLOUDINARY_*` — Cloudinary credentials
- `EMAIL_*` — SMTP settings for Nodemailer
- `SHIPROCKET_*` — Shiprocket API credentials
- `NEXT_PUBLIC_SITE_URL` — your site URL

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Admin login

Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

### 5. Seed sample products

After logging in, seed sample data:

```bash
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Cookie: trustsilcon_admin_token=YOUR_TOKEN"
```

Or use the admin panel to add products manually.

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

### Vercel Cron (Marketing Emails)

The `vercel.json` configures a cron job every 15 days. Set `CRON_SECRET` in env vars. The cron route is protected:

```
GET /api/cron/send-marketing-emails
Authorization: Bearer YOUR_CRON_SECRET
```

Alternatively, use [cron-job.org](https://cron-job.org) to hit this endpoint.

### Shiprocket Webhook

Set webhook URL in Shiprocket dashboard:

```
https://yourdomain.com/api/shiprocket/webhook
```

Header: `x-webhook-secret: YOUR_SHIPROCKET_WEBHOOK_SECRET`

## Project Structure

```
app/
  page.js                 # Home
  shop/                   # Product listing
  products/[slug]/        # Product detail
  cart/ checkout/         # Cart & checkout flow
  track-order/            # Order tracking
  reviews/ contact/ about/ # Content pages
  privacy-policy/ etc.    # Policy pages
  admin/login/            # Admin auth
  admin/(panel)/          # Admin dashboard & management
  api/                    # All API routes
components/               # UI components
context/                  # Cart & Toast providers
lib/                      # DB, auth, email, shiprocket utils
models/                   # Mongoose schemas
middleware.js             # Admin route protection
```

## API Routes

| Route | Description |
|-------|-------------|
| `POST /api/orders` | Create customer order |
| `GET /api/orders` | Track order |
| `GET /api/products` | Public product listing |
| `POST /api/admin/login` | Admin authentication |
| `GET /api/admin/dashboard` | Dashboard stats |
| `POST /api/shiprocket/create-order` | Create Shiprocket shipment |
| `POST /api/shiprocket/webhook` | Tracking updates |
| `GET /api/cron/send-marketing-emails` | Marketing email cron |

## Email System

Transactional emails (always sent):
- Order confirmation
- Order shipped / out for delivery / delivered
- Review request after delivery

Marketing emails (opt-in only, max every 15 days):
- New wellness arrivals
- Includes unsubscribe link: `/unsubscribe?email=...&token=...`

## License

Private — TrustSilcon brand project.
