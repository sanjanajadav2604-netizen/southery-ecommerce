# Deploy Southery Sentie (Frontend + API on Vercel)

## Pattern B: Guest checkout + optional account

Every order is saved to **MongoDB** via `/api/orders`.  
If the customer checks **Create an account**, they receive a **set-password email** after payment.

---

## 1. Install dependencies

```bash
npm install
```

## 2. Vercel environment variables

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `MONGODB_DB` | No | Database name (default: `southery`) |
| `JWT_SECRET` | Yes | Long random string for auth tokens |
| `RAZORPAY_KEY_ID` | Yes | Razorpay public key |
| `RESEND_API_KEY` | Recommended | For order & set-password emails |
| `EMAIL_FROM` | If using Resend | e.g. `Southery Sentie <orders@yourdomain.com>` |
| `FRONTEND_URL` | Yes | Your live URL, e.g. `https://southerysentie.vercel.app` |

Copy from `.env.example`.

## 3. Deploy

Push to GitHub and connect the repo to Vercel, **or**:

```bash
npx vercel --prod
```

The `api/` folder is deployed as serverless functions on the **same domain** as the site.

## 4. Point the frontend at the API

By default, production uses **same-origin** `/api/...` (no extra config).

To use a separate backend instead:

```javascript
localStorage.setItem('southery_api_base', 'https://southery-backend.vercel.app');
```

## 5. Local development with API

```bash
npm install
npm run dev:api
```

Uses `vercel dev` so `/api/orders` works locally. Set env in `.env.local` (Vercel CLI).

Static-only local server (`npm run dev` on port 5500) does **not** run API routes.

---

## API endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/orders` | Create order (guest or logged-in) |
| POST | `/api/orders/track` | Track by order ID + email |
| GET | `/api/orders/myorders` | Logged-in order history |
| POST | `/api/auth/checkout-register` | Create account after order |
| POST | `/api/auth/set-password` | Complete account from email link |
| POST | `/api/auth/signup` | Standard signup |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/config/razorpay` | Razorpay key for checkout |

---

## Migrating from `southery-backend.vercel.app`

You can either:

1. **Use this repo only** — deploy website + `api/` together (recommended), or  
2. **Copy the `api/` folder** into your existing backend repo and keep `southery_api_base` pointing there.

Ensure the same `MONGODB_URI` is used so orders and users stay in one database.
