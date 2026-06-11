# Southery Sentie — Premium Handcrafted Jewelry E-Commerce

> **Live Site:** [southery-ecommerce.vercel.app](https://southery-ecommerce.vercel.app)
> **Live API:** [southery-backend.vercel.app](https://southery-backend.vercel.app)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Complete File Structure](#2-complete-file-structure)
3. [Frontend — Page by Page](#3-frontend--page-by-page)
4. [Backend — Route by Route](#4-backend--route-by-route)
5. [Database Models](#5-database-models)
6. [Authentication Flow](#6-authentication-flow)
7. [Features List](#7-features-list)
8. [Responsive Design Audit](#8-responsive-design-audit)
9. [Bug Report](#9-bug-report)
10. [Missing Features & Improvements](#10-missing-features--improvements)
11. [Security Audit](#11-security-audit)
12. [Performance Audit](#12-performance-audit)
13. [Overall Rating](#13-overall-rating)

---

## 1. PROJECT OVERVIEW

### What Is This?

Southery Sentie is a **premium Indian handcrafted jewelry e-commerce website** targeting women aged 18-45 in India. The brand sells necklaces, earrings, rings, bracelets, and anklets across two main collections: **Handmade** and **Anti-Tarnish**. It supports full guest checkout with Cash on Delivery (COD) and online payment via Razorpay, user account management, wishlist, order tracking, and more.

### Target Audience

- Indian women looking for premium handcrafted and anti-tarnish jewelry
- Gift shoppers (bridal sets, festive jewelry)
- Customers who value craftsmanship and sustainability

### Tech Stack

| Layer | Technology | Hosting |
|---|---|---|
| **Frontend** | HTML5, TailwindCSS v3.4, Vanilla JavaScript | Vercel (Static) |
| **Backend** | Node.js, Express.js v4.19 | Vercel (Serverless) |
| **Database** | MongoDB Atlas (Mongoose v8.4) | MongoDB Cloud |
| **Email** | Resend API | Resend.com |
| **Payments** | Razorpay Checkout v1 | Razorpay |
| **Fonts** | Google Fonts (Cormorant Garamond + Montserrat) | Google CDN |
| **Images** | Unsplash CDN | Unsplash |

### Environment Variables

#### Backend (`southery-backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens | ✅ Yes |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `30d`) | ✅ Yes |
| `PORT` | Server port (default: `5000`) | ❌ Optional |
| `NODE_ENV` | `development` or `production` | ✅ Yes |
| `FRONTEND_URL` | Frontend domain for email links | ✅ Yes |
| `RAZORPAY_KEY_ID` | Razorpay publishable key ID | ✅ Yes |
| `BUSINESS_EMAIL` | Owner email for order notifications | ✅ Yes |
| `RESEND_API_KEY` | Resend.com API key for transactional emails | ✅ Yes |

#### Frontend (`southery-website/.env.example`)

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB connection (for serverless API routes) | ✅ Yes |
| `MONGODB_DB` | Database name | ✅ Yes |
| `JWT_SECRET` | JWT secret (must match backend) | ✅ Yes |
| `RAZORPAY_KEY_ID` | Razorpay public key | ✅ Yes |
| `RESEND_API_KEY` | Resend API key | ❌ Optional |
| `EMAIL_FROM` | Sender email identity | ❌ Optional |
| `FRONTEND_URL` | Live site URL for email links | ✅ Yes |

---

## 2. COMPLETE FILE STRUCTURE

### Frontend (`southery-website/`)

```
southery-website/
├── .env.example            # Template for environment variables
├── .gitignore              # Git exclusions (node_modules, .env, .vercel)
├── AGENT.md                # AI assistant context rules
├── CLAUDE.md               # AI assistant context rules
├── DEPLOY.md               # Deployment instructions
├── README.md               # This file
├── package.json            # NPM config: dev server, Tailwind build scripts
├── tailwind.config.js      # Tailwind config: custom colors, fonts, breakpoints
├── vercel.json             # Vercel static build config (cleanUrls enabled)
├── local-server.js         # Custom Node.js dev server with clean URL support
├── favicon.svg             # SVG favicon
│
├── css/
│   ├── styles.css          # 1544 lines — custom CSS: design system, components, animations
│   └── tailwind.css        # 69KB — compiled Tailwind output
│
├── src/
│   └── input.css           # Tailwind directives entry point (58 bytes)
│
├── js/
│   ├── layout.js           # 1588 lines — CORE: API client, sidebars, cart, wishlist, auth modals,
│   │                       #   search, toasts, newsletter, cursor, scroll animations, session mgmt
│   └── products.js         # 24 products hardcoded as JS array (client-side product catalog)
│
├── api/
│   └── _lib/
│       └── auth.js         # Empty file (2 bytes) — unused Vercel serverless auth stub
│
├── data/                   # Jetro research data (datasets, lists, stocks) — NOT part of site
│
├── index.html              # Home page (1519 lines)
├── shop.html               # Product listing + filters (65KB)
├── product.html            # Single product detail page (78KB)
├── cart.html                # Full cart page (28KB)
├── checkout.html           # 3-step checkout with Razorpay (77KB)
├── done.html               # Order confirmation page (15KB)
├── account.html            # User dashboard: profile, orders, addresses, settings (78KB)
├── wishlist.html            # Full wishlist page (24KB)
├── about.html              # Brand story page (33KB)
├── contact.html            # Contact form page (32KB)
├── order-tracking.html     # Order tracking by ID + email (32KB)
├── set-password.html       # Set/reset password via token (4.8KB)
├── care-guide.html         # Jewelry care guide (34KB)
├── faq.html                # FAQ accordion page (87KB)
├── shipping.html           # Shipping & returns policy (32KB)
├── privacy.html            # Privacy policy (28KB)
├── terms.html              # Terms of service (24KB)
├── 404.html                # Custom 404 page (18KB)
└── projects/               # Empty directory
```

### Backend (`southery-backend/`)

```
southery-backend/
├── .env                    # ⚠️ LIVE secrets (committed — security issue!)
├── .gitignore              # Git exclusions
├── package.json            # NPM config: express, mongoose, bcryptjs, etc.
├── vercel.json             # Vercel serverless routing config
├── seedAdmin.js            # Script to create admin user (⚠️ hardcoded credentials)
├── migrateProducts.js      # Script to seed 24 products + mock orders
│
└── src/
    ├── server.js           # Express app: middleware, CORS, routes, error handler, startup
    │
    ├── config/
    │   └── db.js           # MongoDB connection with TCP pre-check diagnostics
    │
    ├── controllers/
    │   ├── authController.js       # signup, login, getMe, forgotPassword, resetPassword,
    │   │                           #   checkoutRegister, address CRUD
    │   ├── productController.js    # CRUD for products (admin), public get all/by-slug
    │   ├── orderController.js      # createOrder (guest+auth), getMyOrders, getOrderById,
    │   │                           #   trackOrder (dynamic status generation)
    │   └── analyticsController.js  # Dashboard stats, sales analytics (admin only)
    │
    ├── middleware/
    │   ├── auth.js             # JWT protect middleware + restrictTo role guard
    │   ├── errorHandler.js     # Global error handler (dev vs prod error formatting)
    │   └── rateLimiter.js      # Rate limiters: apiLimiter, authLimiter, contactLimiter
    │
    ├── models/
    │   ├── User.js         # User schema: name, email, password, cart, wishlist, addresses, role
    │   ├── Product.js      # Product schema: name, sku, price, category, collection, stock, etc.
    │   ├── Order.js        # Order schema: items, shipping, payment, status tracking
    │   └── Contact.js      # Contact form submissions
    │
    ├── routes/
    │   ├── auth.js         # /api/auth/* — signup, login, forgot/reset password, addresses
    │   ├── products.js     # /api/products/* — public listing + admin CRUD
    │   ├── orderRoutes.js  # /api/orders/* — create, track, myorders, by-id
    │   ├── cart.js         # /api/cart/* — add, remove, clear, get (all protected)
    │   ├── wishlist.js     # /api/wishlist/* — add, remove, get (all protected)
    │   └── analytics.js    # /api/analytics/* — admin-only dashboard stats + sales report
    │
    └── utils/
        ├── AppError.js     # Custom error class (operational vs programming errors)
        └── sendEmail.js    # Resend API email sender utility
```

---

## 3. FRONTEND — PAGE BY PAGE

### 3.1 `index.html` — Home Page

**Purpose:** Landing page showcasing the brand, collections, and products.

**Sections:**
1. **Announcement Bar** — Free shipping offer + discount code `FIRST10`
2. **Navigation** — Logo, nav links (Home, Shop, About, Contact), search/wishlist/cart/auth icons
3. **WhatsApp Float** — Links to `wa.me/919624118668`
4. **Hero Section** — Headline "Timeless Elegance, Crafted for You", 3 CTA buttons (Shop Collection, Anti-Tarnish, Handmade), floating product cards with hover animations, circular hero image
5. **Category Carousel** — 5 auto-rotating slides (Necklaces, Earrings, Rings, Bracelets, Anklets) with staggered animations, dot navigation, 5-second auto-rotate
6. **Category Scroll Cards** — Horizontal scroll cards linking to filtered shop views
7. **Products Grid** — Dynamic product card grid loaded from `products.js`
8. **Trust Badges** — Icons for free shipping, handmade guarantee, easy returns
9. **Testimonials** — Dark-themed customer review cards
10. **Newsletter** — Email subscription form ("Join the Sentie Inner Circle")
11. **Footer** — Brand info, category links, support links, social media (Instagram, Twitter/X), copyright

**Buttons & Actions:**
| Button | Action |
|---|---|
| "Shop Collection" | Navigates to `shop.html` |
| "Anti-Tarnish" | Navigates to `shop.html?collection=anti-tarnish` |
| "Handmade" | Navigates to `shop.html?collection=handmade` |
| Category "Shop Now" | Navigates to `shop.html?category={category}` |
| Search icon | Opens search drawer (`toggleSearch()`) |
| Wishlist icon | Opens wishlist sidebar (`toggleWishlist()`) |
| Cart icon | Opens cart sidebar (`toggleCart()`) |
| Sign In | Opens auth modal (`openAuthModal()`) |
| WhatsApp float | Opens `wa.me/919624118668` in new tab |
| Newsletter Subscribe | `handleNewsletter(event)` — mock or Mailchimp JSONP |

**API Calls:** None directly. Product data loaded from `js/products.js` (hardcoded array).

**localStorage Keys Read:**
- `southery_cart`, `southery_wishlist`, `southery_user`, `southery_token`, `recent_searches`, `southery_app_version`

**Animations:**
- Hero floating cards (`floatUpDown` keyframes)
- Category carousel (CSS crossfade with staggered text reveal)
- Intersection Observer scroll-reveal on `.animate-in` elements
- Custom luxury cursor with follower (desktop only, >1024px)
- Header shrink on scroll

---

### 3.2 `shop.html` — Shop / Product Listing

**Purpose:** Browse all products with filtering and sorting.

**Sections:**
1. Announcement Bar + Navigation (duplicated from index)
2. Page Header ("Shop All Pieces")
3. Filter Bar — Category pills, collection filter, price sort, search input
4. Mobile Filter Sidebar — Slide-out panel with all filters
5. Products Grid — Dynamically rendered from `products.js`
6. Empty State — "No products match" message
7. Newsletter + Footer

**Buttons & Actions:**
| Button | Action |
|---|---|
| Category pills | Filters products by category (necklace, earring, etc.) |
| Collection filter | Filters by `handmade` or `anti-tarnish` |
| Sort dropdown | Sorts by price (low→high, high→low), name, newest |
| Product card click | Navigates to `product.html?id={id}` |
| Heart icon on card | `toggleWishlistItem(id)` — adds/removes from wishlist |
| Add to bag (floating pill) | `addToCart(id)` |
| Quick View | Opens detail modal overlay |

**URL Query Parameters Read:**
- `?category=necklace` — Pre-selects category filter
- `?collection=anti-tarnish` — Pre-selects collection filter
- `?search=emerald` — Pre-fills search and filters results

**localStorage Keys:** Same as index (cart, wishlist, user, token).

---

### 3.3 `product.html` — Single Product Detail

**Purpose:** Full product page with image gallery, specs, add-to-cart, and related products.

**Sections:**
1. Navigation + Breadcrumb
2. Product Image Gallery — Main image + thumbnail selector
3. Product Info — Name, price (with compare/strikethrough price), description, stock indicator
4. Quantity Selector + Add to Cart + Add to Wishlist
5. Product Specs (metal, weight, stones, finish)
6. "You May Also Like" — Related product cards
7. Footer

**URL Query Parameters Read:** `?id={number}` — Product ID from `products.js`

**Buttons & Actions:**
| Button | Action |
|---|---|
| Add to Bag | `addToCart(id, qty)` |
| Heart/Wishlist | `toggleWishlistItem(id)` |
| Quantity +/- | Increments/decrements local quantity state |
| Thumbnail click | Swaps main product image |
| Related product click | Navigates to `product.html?id={relatedId}` |

**API Calls:** None (data from `products.js`).

---

### 3.4 `cart.html` — Full Cart Page

**Purpose:** Detailed view of all cart items with quantity controls and totals.

**Sections:**
1. Navigation
2. Cart Items List — Product image, name, price, quantity +/- controls, remove button
3. Cart Summary — Subtotal, shipping info, total
4. "Proceed to Checkout" CTA
5. "Continue Shopping" link
6. Empty cart state

**Buttons & Actions:**
| Button | Action |
|---|---|
| Quantity +/- | `updateCartQty(id, ±1)` |
| Remove (×) | `updateCartQty(id, -qty)` — removes item |
| Proceed to Checkout | Navigates to `checkout.html` |
| Continue Shopping | Navigates to `shop.html` |

**localStorage:** Reads/writes `southery_cart`.

---

### 3.5 `checkout.html` — Checkout

**Purpose:** 3-step checkout flow: Contact Info → Shipping → Payment.

**Sections:**
1. Navigation
2. Mobile sticky price header
3. **Step 1: Contact Information** — Email, phone (+91 prefix), "Create account" checkbox
4. **Step 2: Shipping Address** — First name, last name, address, city, state (dropdown with all 36 Indian states/UTs), pincode (6-digit validated), order notes
5. **Step 3: Payment Method** — Radio: Online Payment (Razorpay) or Cash on Delivery
6. Mobile Review Section — Order items summary
7. Terms checkbox (required)
8. "Complete Order" button
9. Desktop Order Summary sidebar — Subtotal, shipping (Free), GST (3%), promo code input, total
10. Newsletter + Footer

**Forms & Validation:**
| Field | Validation |
|---|---|
| Email | `type="email"`, required |
| Phone | 10-digit numeric only (`oninput` strips non-digits), `maxlength="10"` |
| First/Last Name | `type="text"`, required |
| Address | `type="text"`, required |
| City | `type="text"`, required |
| State | `<select>`, required |
| Pincode | 6-digit pattern `[0-9]{6}`, `maxlength="6"` |
| Terms checkbox | Required |

**API Calls:**
| Endpoint | Method | Body | Purpose |
|---|---|---|---|
| `POST /api/orders` | POST | `{ orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, guestEmail, guestPhone, guestName, createAccount }` | Creates order |
| `POST /api/auth/checkout-register` | POST | `{ email, name }` | Creates account from guest checkout (if checkbox checked) |
| `GET /api/config/razorpay` | GET | — | Fetches Razorpay key ID for client-side payment |

**Payment Flow:**
1. If "Online Payment" selected → Fetches Razorpay key → Opens Razorpay Checkout modal
2. On successful payment → Creates order with `paymentResult`
3. If "COD" selected → Creates order directly with `paymentMethod: 'COD'`
4. On success → Redirects to `done.html?orderId={id}`

**localStorage:** Reads `southery_cart`, `southery_token`, `southery_user`. Clears cart on success.

---

### 3.6 `done.html` — Order Confirmation

**Purpose:** Post-checkout success page with order ID and next steps.

**Sections:**
1. Success animation/icon
2. Order ID display
3. "Your order has been placed" message
4. "Track Order" and "Continue Shopping" CTAs
5. "Create Account" prompt (for guest users)

---

### 3.7 `account.html` — User Account Dashboard

**Purpose:** Unified account page handling login, signup, and post-login dashboard.

**Sections:**
1. **Auth Container (logged out):**
   - Login form (email + password + forgot password)
   - Signup form (name + email + password)
   - Tab switching between Login/Signup
2. **Dashboard (logged in):**
   - Welcome header with user name
   - Tab navigation: Overview, Orders, Addresses, Settings
   - **Overview tab** — Quick stats (total orders, wishlist count)
   - **Orders tab** — Order history list with status badges, dates, totals
   - **Addresses tab** — Saved address list with add/edit/delete/set-primary
   - **Settings tab** — Logout button

**API Calls:**
| Endpoint | Method | Purpose |
|---|---|---|
| `POST /api/auth/login` | POST | Login |
| `POST /api/auth/signup` | POST | Signup |
| `GET /api/auth/me` | GET | Validate session |
| `GET /api/orders/myorders` | GET | Fetch user's order history |
| `GET /api/auth/addresses` | GET | Fetch saved addresses |
| `POST /api/auth/addresses` | POST | Add new address |
| `PUT /api/auth/addresses/:id` | PUT | Update address |
| `DELETE /api/auth/addresses/:id` | DELETE | Delete address |
| `POST /api/auth/forgot-password` | POST | Send reset email |

**localStorage Keys:** `southery_token`, `southery_user`, `southery_orders`, `southery_cart`, `southery_wishlist`

---

### 3.8 `wishlist.html` — Full Wishlist Page

**Purpose:** Displays all wishlisted products with add-to-cart and remove options.

**Buttons:** "Add to Bag" (`addToCartFromWishlist(id)`), "Remove" (`toggleWishlistItem(id)`)

---

### 3.9 `order-tracking.html` — Order Tracking

**Purpose:** Public page for guests and users to track orders by Order ID + Email.

**Form Fields:** Order ID (text), Email (email) — both required.

**API Call:** `POST /api/orders/track` with `{ orderId, email }`

**Response Display:** Progress bar (10%→100%), status label, estimated delivery, chronological history timeline.

---

### 3.10 `set-password.html` — Set/Reset Password

**Purpose:** Allows users to set a password via a tokenized link (sent via email after guest checkout or forgot password).

**URL Params:** `?token={resetToken}&email={email}`

**Form Fields:** Email (readonly, pre-filled), New Password, Confirm Password.

**API Call:** `POST /api/auth/set-password` (Note: calls `set-password` but backend actually has `reset-password` — see Bug Report).

**On Success:** Stores token + user in localStorage, redirects to `account.html`.

---

### 3.11 `contact.html` — Contact Form

**Form Fields:** Name, Email, Subject (optional), Message, Website (hidden honeypot).

**API Call:** `POST /api/contact` with `{ name, email, subject, message, website }`

**Rate Limited:** 3 messages per IP per 24 hours.

---

### 3.12 `about.html` — Brand Story

Static content page: brand values, craftsmanship story, sustainability mission. No API calls.

---

### 3.13 `care-guide.html` — Jewelry Care Guide

Static content: care instructions for different jewelry types. No API calls.

---

### 3.14 `faq.html` — FAQ Page

Accordion-style Q&A (87KB — largest content page). Pure CSS/JS accordion. No API calls.

---

### 3.15 `shipping.html` — Shipping & Returns Policy

Static policy page. No API calls.

---

### 3.16 `privacy.html` — Privacy Policy

Static legal page. No API calls.

---

### 3.17 `terms.html` — Terms of Service

Static legal page. No API calls.

---

### 3.18 `404.html` — Custom 404 Page

Branded 404 page with "Go Home" button. Served by `local-server.js` and Vercel.

---

## 4. BACKEND — ROUTE BY ROUTE

### 4.1 Auth Routes (`/api/auth`)

All auth routes have `authLimiter` applied (10 requests/min/IP).

| Method | URL | Protected? | Request Body | Response | Notes |
|---|---|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ No | `{ name, email, password }` | `{ status, message, token, user }` | Validation via `express-validator`. Duplicate email returns 400. |
| `POST` | `/api/auth/login` | ❌ No | `{ email, password }` | `{ status, message, token, user }` | Compares bcrypt hash. Returns 401 on mismatch. |
| `POST` | `/api/auth/forgot-password` | ❌ No | `{ email }` | `{ status, message }` | Always returns success (prevents email enumeration). Sends Resend email with reset link. Token valid 1 hour. |
| `POST` | `/api/auth/reset-password` | ❌ No | `{ token, email, password }` | `{ status, message, token, user }` | Validates token + expiry. Sets new password + logs user in. |
| `POST` | `/api/auth/checkout-register` | ❌ No | `{ email, name }` | `{ status, message, token, user }` | Creates account without password (sets `isPasswordSet: false`). Sends set-password email. Links past guest orders. |
| `GET` | `/api/auth/me` | ✅ Yes | — | `{ status, user }` | Returns safe user object (no password). |
| `GET` | `/api/auth/addresses` | ✅ Yes | — | `{ status, addresses }` | Returns user's saved addresses array. |
| `POST` | `/api/auth/addresses` | ✅ Yes | `{ label, line1, line2, city, state, pincode, isPrimary }` | `{ status, addresses }` | Pushes new address. If `isPrimary`, unsets others. |
| `PUT` | `/api/auth/addresses/:id` | ✅ Yes | Address fields | `{ status, addresses }` | Updates specific address subdocument. |
| `DELETE` | `/api/auth/addresses/:id` | ✅ Yes | — | `{ status, addresses }` | Removes address from array. |

---

### 4.2 Product Routes (`/api/products`)

| Method | URL | Protected? | Request Body/Params | Response | Notes |
|---|---|---|---|---|---|
| `GET` | `/api/products` | ❌ No | — | `{ status, results, data: { products } }` | Returns all products sorted by `createdAt` desc. No pagination. |
| `GET` | `/api/products/:slug` | ❌ No | URL param: `slug` | `{ status, data: { product } }` | Finds by slug field. Returns 404 if not found. |
| `POST` | `/api/products` | ✅ Admin | Product body | `{ status, data: { product } }` | Creates product. Requires `protect` + `restrictTo('admin')`. |
| `PATCH` | `/api/products/:id` | ✅ Admin | Product fields | `{ status, data: { product } }` | Updates by MongoDB `_id`. Runs validators. |
| `DELETE` | `/api/products/:id` | ✅ Admin | — | `204 No Content` | Hard deletes product. |

---

### 4.3 Order Routes (`/api/orders`)

| Method | URL | Protected? | Request Body | Response | Notes |
|---|---|---|---|---|---|
| `POST` | `/api/orders` | ❌ No | `{ orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, guestEmail, guestPhone, guestName, createAccount }` | `{ status, data: order }` | Guest checkout allowed. Resolves product IDs by name. Sends email notification to business owner. If `createAccount` is true, creates user account. |
| `POST` | `/api/orders/track` | ❌ No | `{ orderId, email }` | `{ status, orderId, statusLabel, estimatedDelivery, progress, history }` | Public tracking. Validates 24-char MongoDB ObjectId format. Verifies email matches. Generates dynamic tracking timeline based on order age. |
| `GET` | `/api/orders/myorders` | ✅ Yes | — | `{ status, results, data: orders }` | Returns orders by `user_id` OR matching `guestEmail`. Sorted by newest first. |
| `GET` | `/api/orders/:id` | ✅ Yes | URL param: `id` | `{ status, data: order }` | Populates `user_id` with name + email. |

---

### 4.4 Cart Routes (`/api/cart`) — All Protected

| Method | URL | Request Body | Response | Notes |
|---|---|---|---|---|
| `GET` | `/api/cart` | — | `{ status, cart }` | Returns user's cart array. |
| `POST` | `/api/cart/add` | `{ productId, name, price, quantity, image }` | `{ status, cart }` | If item exists, increments quantity. Otherwise pushes new. |
| `DELETE` | `/api/cart/remove/:id` | URL param: `id` (productId) | `{ status, cart }` | Filters out item by `productId`. |
| `DELETE` | `/api/cart/clear` | — | `{ status, cart: [] }` | Empties entire cart. |

---

### 4.5 Wishlist Routes (`/api/wishlist`) — All Protected

| Method | URL | Request Body | Response | Notes |
|---|---|---|---|---|
| `GET` | `/api/wishlist` | — | `{ status, wishlist }` | Returns user's wishlist array. |
| `POST` | `/api/wishlist/add` | `{ productId, name, price, image }` | `{ status, wishlist }` | No-op if already exists. |
| `DELETE` | `/api/wishlist/remove/:id` | URL param: `id` (productId) | `{ status, wishlist }` | Filters out item by `productId`. |

---

### 4.6 Analytics Routes (`/api/analytics`) — Admin Only

| Method | URL | Response |
|---|---|---|
| `GET` | `/api/analytics/dashboard-stats` | `{ totalProducts, lowStock, totalRevenue, totalOrders }` |
| `GET` | `/api/analytics/sales-report?period=week\|month\|year` | Aggregated sales data: `{ _id, numOrders, revenue, returns }` |

---

### 4.7 Other Routes

| Method | URL | Protected? | Purpose |
|---|---|---|---|
| `GET` | `/api/config/razorpay` | ❌ No | Returns `{ status, keyId }` for client-side Razorpay init. |
| `POST` | `/api/contact` | ❌ No (rate limited: 3/day) | Saves contact form + emails business owner. Honeypot spam detection. |

---

## 5. DATABASE MODELS

### 5.1 User Model (`User.js`)

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `name` | String | ✅ Yes | — | 2-50 chars, trimmed |
| `email` | String | ✅ Yes | — | Unique, lowercase, regex validated |
| `password` | String | ❌ No | — | Min 6 chars, `select: false` (excluded from queries), bcrypt hashed (12 rounds) |
| `passwordSetToken` | String | ❌ No | — | Random 32-byte hex for guest account activation |
| `passwordSetExpires` | Date | ❌ No | — | 24h expiry for set-password link |
| `isPasswordSet` | Boolean | ❌ No | `true` | Set to `false` for checkout-created accounts |
| `passwordResetToken` | String | ❌ No | — | For forgot password flow |
| `passwordResetExpires` | Date | ❌ No | — | 1h expiry |
| `role` | String | ❌ No | `'user'` | Enum: `['user', 'admin']` |
| `cart` | Array | ❌ No | `[]` | `[{ productId, name, price, quantity, image }]` |
| `wishlist` | Array | ❌ No | `[]` | `[{ productId, name, price, image }]` |
| `addresses` | Array | ❌ No | `[]` | `[{ label, line1, line2, city, state, pincode, isPrimary }]` — ⚠️ DEFINED TWICE (bug) |
| `isActive` | Boolean | ❌ No | `true` | Soft-delete flag |
| `createdAt` / `updatedAt` | Date | Auto | — | Mongoose timestamps |

**Pre-save Hook:** Hashes password with bcrypt (12 rounds) if modified.
**Instance Methods:** `comparePassword(entered)`, `toSafeObject()` (returns id, name, email, role, createdAt).

**Indexes:** Email unique index (from `unique: true`).

---

### 5.2 Product Model (`Product.js`)

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `name` | String | ✅ Yes | — | Unique, max 100 chars |
| `slug` | String | ❌ No | Auto-generated | Lowercase, hyphenated from name |
| `sku` | String | ✅ Yes | — | Unique, uppercase, trimmed |
| `description` | String | ✅ Yes | — | Trimmed |
| `price` | Number | ✅ Yes | — | — |
| `comparePrice` | Number | ❌ No | — | Must be > `price` (validator on new docs only) |
| `category` | String | ✅ Yes | — | Enum: `['necklace', 'earring', 'bracelet', 'ring', 'anklet', 'set']` |
| `collectionName` | String | ✅ Yes | — | Enum: `['handmade', 'anti-tarnish', 'bridal', 'minimalist']` |
| `material` | String | ❌ No | — | — |
| `stock` | Number | ✅ Yes | `0` | — |
| `images` | [String] | ✅ Yes | — | Array of image URLs |
| `specs` | Object | ❌ No | — | `{ metal, weight, stones, finish }` |
| `isFeatured` | Boolean | ❌ No | `false` | — |
| `ratingsAverage` | Number | ❌ No | `4.5` | Min 1, Max 5 |
| `ratingsQuantity` | Number | ❌ No | `0` | — |
| `salesCount` | Number | ❌ No | `0` | — |

**Indexes:** `{ price: 1, ratingsAverage: -1 }`, `{ slug: 1 }`, text index on `{ name, description }`.

**Pre-save Hook:** Auto-generates slug from name (lowercase, hyphenated).

**Virtuals:** Enabled (`toJSON: { virtuals: true }`).

---

### 5.3 Order Model (`Order.js`)

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `user_id` | ObjectId (ref: User) | ❌ No | — | Optional for guest checkouts |
| `guestEmail` | String | ❌ No | — | — |
| `guestPhone` | String | ❌ No | — | — |
| `guestName` | String | ❌ No | — | — |
| `orderItems` | Array | ✅ Yes | — | `[{ name, quantity, image, price, product (ObjectId) }]` |
| `shippingAddress` | Object | ✅ Yes | — | `{ firstName, lastName, address, city, postalCode, country, phone }` |
| `paymentMethod` | String | ✅ Yes | `'Razorpay'` | Enum: `['Razorpay', 'COD', 'Card']` |
| `paymentResult` | Object | ❌ No | — | `{ id, status, update_time, email_address }` |
| `itemsPrice` | Number | ✅ Yes | `0.0` | — |
| `shippingPrice` | Number | ✅ Yes | `0.0` | — |
| `totalPrice` | Number | ✅ Yes | `0.0` | — |
| `isPaid` | Boolean | ✅ Yes | `false` | — |
| `paidAt` | Date | ❌ No | — | — |
| `isDelivered` | Boolean | ✅ Yes | `false` | — |
| `deliveredAt` | Date | ❌ No | — | — |
| `status` | String | ✅ Yes | `'Processing'` | Enum: `['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned']` |

**Indexes:** `{ createdAt: 1, status: 1 }`, `{ user_id: 1 }`.

---

### 5.4 Contact Model (`Contact.js`)

| Field | Type | Required | Default |
|---|---|---|---|
| `name` | String | ✅ Yes | — |
| `email` | String | ✅ Yes | — (regex validated) |
| `subject` | String | ❌ No | — |
| `message` | String | ✅ Yes | — |
| `createdAt` | Date | ❌ No | `Date.now` |

---

## 6. AUTHENTICATION FLOW

### 6.1 Signup Flow

1. User fills name, email, password on modal or account page
2. Frontend calls `POST /api/auth/signup` with `express-validator` validation
3. Backend creates user with bcrypt-hashed password (12 rounds)
4. Backend returns JWT token (valid 30 days) + safe user object
5. Frontend stores `southery_token` and `southery_user` in localStorage
6. Auth UI updates (avatar initial, name display)

### 6.2 Login Flow

1. User enters email + password
2. Frontend calls `POST /api/auth/login`
3. Backend finds user by email, selects password field (`+password`)
4. Compares entered password vs bcrypt hash
5. Returns JWT + user object on success
6. Frontend stores token, clears old cart/wishlist from localStorage
7. Fetches fresh cart + wishlist from API (`fetchUserCartAndWishlist()`)

### 6.3 Forgot Password Flow

1. User clicks "Forgot Password?" → reveals email input
2. Submits email via `POST /api/auth/forgot-password`
3. Backend generates 32-byte random token, saves to `passwordResetToken`, sets 1-hour expiry
4. Sends email via Resend with link: `{FRONTEND_URL}/set-password.html?token={token}&email={email}`
5. Always returns success message (prevents email enumeration)

### 6.4 Reset Password Flow

1. User clicks email link → opens `set-password.html` with `token` + `email` in URL params
2. Enters new password + confirmation
3. Frontend calls `POST /api/auth/reset-password` (⚠️ but page calls `/api/auth/set-password` — BUG)
4. Backend validates token + expiry + email match
5. Sets new password (triggers bcrypt pre-save hook), clears token fields
6. Returns JWT + user → auto-logged in

### 6.5 Guest Checkout → Account Conversion

1. Guest completes checkout with email
2. If "Create account" checkbox is checked:
   - Backend creates User with `isPasswordSet: false` and `passwordSetToken`
   - Sends set-password email to guest
   - Links all past guest orders (by `guestEmail`) to the new user account
3. Guest can later set password and access full account

### 6.6 JWT Token Details

- **Storage:** `localStorage` key `southery_token`
- **Format:** `Bearer {token}` in `Authorization` header
- **Expiry:** 30 days (configurable via `JWT_EXPIRES_IN`)
- **Verification:** On every page load, `loadUserFromServer()` calls `GET /api/auth/me` to validate
- **Fallback:** If network error (5xx/offline), falls back to local cached user — does NOT log out
- **Logout triggers:** Only on definitive 401/403 auth errors

---

## 7. FEATURES LIST

### 7.1 Cart

| Feature | Status | Details |
|---|---|---|
| Add to cart | ✅ Working | Via product card, product page, or wishlist |
| Remove from cart | ✅ Working | Single item or entire cart |
| Update quantity | ✅ Working | +/- buttons in sidebar and cart page |
| Cart sidebar | ✅ Working | Slide-in panel from right |
| Full cart page | ✅ Working | `cart.html` with detailed view |
| Cart badge counts | ✅ Working | Header + mobile bottom nav badges |
| Cart persistence | ✅ Working | localStorage (`southery_cart`) + API sync for logged-in users |
| Server sync | ✅ Working | Syncs with `/api/cart` on login and on add/remove |
| Low stock warnings | ✅ Working | "Only X left" badge on cards |
| Empty cart state | ✅ Working | Branded message with "Discover Now" CTA |

### 7.2 Wishlist

| Feature | Status | Details |
|---|---|---|
| Add/remove | ✅ Working | Heart toggle on product cards |
| Wishlist sidebar | ✅ Working | Slide-in panel from right |
| Full wishlist page | ✅ Working | `wishlist.html` |
| Move to cart | ✅ Working | "Add to Bag" from wishlist |
| Server sync | ✅ Working | Syncs with `/api/wishlist` for logged-in users |
| Toast notifications | ✅ Working | "Saved to wishlist" / "Removed from wishlist" |

### 7.3 Checkout

| Feature | Status | Details |
|---|---|---|
| Guest checkout | ✅ Working | No login required |
| Razorpay online payment | ⚠️ Partial | Key is placeholder (`REPLACE_WITH_YOUR_RAZORPAY_KEY_ID`) |
| Cash on Delivery | ✅ Working | Full COD flow |
| Order creation | ✅ Working | Backend saves order + sends email |
| Promo codes | ⚠️ Frontend Only | `FIRST10` gives 10% off (client-side validation only, not server-verified) |
| GST calculation | ✅ Working | 3% GST applied |
| Free shipping | ✅ Working | Always free shipping |
| Create account checkbox | ✅ Working | Guest → account conversion |
| Order confirmation | ✅ Working | Redirects to `done.html` |
| Business email notification | ✅ Working | Owner gets email on every order |

### 7.4 Order History & Tracking

| Feature | Status | Details |
|---|---|---|
| My Orders page | ✅ Working | Account dashboard → Orders tab |
| Order tracking | ✅ Working | Public `order-tracking.html` with progress bar |
| Dynamic status timeline | ✅ Working | Progress calculated from order age (simulated) |
| Guest order linking | ✅ Working | Orders linked to account when guest creates account |

### 7.5 Saved Addresses

| Feature | Status | Details |
|---|---|---|
| Add address | ✅ Working | Account → Addresses tab |
| Edit address | ✅ Working | In-place editing |
| Delete address | ✅ Working | With confirmation |
| Set primary | ✅ Working | Toggle primary flag |

### 7.6 Profile & Settings

| Feature | Status | Details |
|---|---|---|
| View profile | ✅ Working | Name + email display |
| Logout | ✅ Working | Clears all localStorage |
| Edit profile | ❌ Missing | No name/email change functionality |
| Change password | ❌ Missing | No password change from settings |

### 7.7 Newsletter

| Feature | Status | Details |
|---|---|---|
| Email subscription | ⚠️ Mock | Uses `showCustomAlert()` confirmation — no real email list |
| Mailchimp integration | 🔧 Ready | Config exists but `USE_MAILCHIMP: false` |

### 7.8 Contact Form

| Feature | Status | Details |
|---|---|---|
| Submit message | ✅ Working | Saved to Contact model + emails owner |
| Honeypot spam protection | ✅ Working | Hidden `website` field |
| Rate limiting | ✅ Working | 3 messages per IP per day |

### 7.9 Search

| Feature | Status | Details |
|---|---|---|
| Real-time search | ✅ Working | Filters from `products.js` array |
| Trending suggestions | ✅ Working | Handmade, Anti-Tarnish, Necklaces, Earrings |
| Recent searches | ✅ Working | Persisted in localStorage (up to 5) |
| Search → shop redirect | ✅ Working | "View All Results" navigates to `shop.html?search=` |
| Server-side search | ❌ Missing | All searching is client-side from hardcoded products.js |

### 7.10 Admin Panel

**No dedicated admin panel exists.** Admin functionality is limited to:
- Backend API routes protected by `restrictTo('admin')` for product CRUD and analytics
- `seedAdmin.js` script to create admin user
- `migrateProducts.js` to seed product data
- No admin UI/dashboard in the frontend

---

## 8. RESPONSIVE DESIGN AUDIT

### Testing Breakpoints

| Viewport | Width | Result |
|---|---|---|
| iPhone SE | 375px | ✅ Good — layouts stack, mobile nav works |
| iPhone 12/13 | 390px | ✅ Good |
| Tablet | 768px | ✅ Good — grid switches from 1→2 cols |
| Desktop | 1280px | ✅ Good — full layout with sidebars |
| Large Desktop | 1536px | ✅ Good — `max-width: 1400px` container |

### Page-by-Page Responsiveness

| Page | Mobile (375px) | Tablet (768px) | Desktop (1280px) | Issues |
|---|---|---|---|---|
| index.html | ✅ | ✅ | ✅ | Hero circle image hidden on mobile (design choice) |
| shop.html | ✅ | ✅ | ✅ | Filter sidebar works well on mobile |
| product.html | ✅ | ✅ | ✅ | — |
| cart.html | ✅ | ✅ | ✅ | — |
| checkout.html | ✅ | ✅ | ✅ | Mobile hides footer + bottom nav (good UX) |
| account.html | ✅ | ✅ | ✅ | Tab system responsive |
| wishlist.html | ✅ | ✅ | ✅ | — |
| faq.html | ✅ | ✅ | ✅ | Accordion works on all sizes |
| order-tracking.html | ✅ | ✅ | ✅ | — |
| contact.html | ✅ | ✅ | ✅ | — |

### Touch Target Compliance

- ✅ Header icon buttons: 40×40px (meets 44px guideline closely)
- ✅ Mobile bottom nav buttons: adequate tap area
- ✅ Cart quantity buttons: 24×24px (⚠️ slightly small for fat fingers)
- ✅ Sidebar close buttons: 40×40px
- ⚠️ Category dot indicators: 8×8px — very small on mobile (usability concern)

### Specific Findings

1. **iOS Input Zoom:** ✅ Handled — `font-size: 16px !important` on inputs below 768px prevents Safari zoom
2. **Safe Area Insets:** ✅ Handled — `padding-bottom: env(safe-area-inset-bottom)` on mobile bottom nav
3. **Small Screen Breakpoint (≤380px):** ✅ Extra scale-down rules for header on very small screens
4. **Horizontal Scroll:** Category scroll cards use `overflow-x: auto` with `scroll-snap-type` — smooth on touch
5. **Body padding:** ✅ Extra `padding-bottom: 70px` on mobile to avoid content behind bottom nav

---

## 9. BUG REPORT

### Critical Bugs

| # | Bug | File | Severity | Reproduction |
|---|---|---|---|---|
| 1 | **`.env` file with LIVE secrets committed to git** | `southery-backend/.env` | 🔴 Critical | Open the file — contains real MongoDB URI (with password), JWT secret, Resend API key. This is a production security breach. |
| 2 | **`seedAdmin.js` has hardcoded MongoDB credentials** | `southery-backend/seedAdmin.js:5` | 🔴 Critical | File contains a different MongoDB password (`Sanjana2026`) hardcoded directly in source code, not using `.env`. |

### High Bugs

| # | Bug | File | Severity | Reproduction |
|---|---|---|---|---|
| 3 | **`set-password.html` calls wrong API endpoint** | `set-password.html:79` | 🔴 High | Page calls `POST /api/auth/set-password` but backend only has `POST /api/auth/reset-password`. The set-password page will always fail with 404. |
| 4 | **`addresses` field defined TWICE in User schema** | `User.js:61-78` | 🟠 High | The `addresses` array is defined at lines 61-68 AND again at lines 70-78. The second definition silently overwrites the first. Not a runtime crash but indicates copy-paste error and could cause confusion. |
| 5 | **API rate limiter disabled** | `server.js:41` | 🟠 High | `app.use('/api', apiLimiter)` is commented out with note "TEMPORARILY DISABLED FOR SYNC". This removes rate limiting on all non-auth API routes. |
| 6 | **Promo code validated client-side only** | `checkout.html` (JS) | 🟠 High | The `FIRST10` promo gives 10% off but is only validated in frontend JavaScript. Backend receives the discounted price directly — no server-side promo validation. Attackers can modify the price payload. |
| 7 | **Default JWT secret in production code** | `auth.js:17`, `authController.js:19` | 🟠 High | Both files have `process.env.JWT_SECRET \|\| 'default_secret_for_boutique_auth_testing_123'`. If env var is missing, all tokens use a publicly visible default secret. |

### Medium Bugs

| # | Bug | File | Severity | Reproduction |
|---|---|---|---|---|
| 8 | **`migrateProducts.js` references `order.user` instead of `order.user_id`** | `migrateProducts.js:58` | 🟡 Medium | Mock orders use `user` field but Order schema expects `user_id`. Orders created by migration won't be linked to users properly. |
| 9 | **Products sourced from hardcoded JS, not from API** | `products.js` + all HTML pages | 🟡 Medium | Frontend loads products from `js/products.js` (24 hardcoded items) instead of `GET /api/products`. Backend products in MongoDB are not displayed. Data is out of sync. |
| 10 | **Error handler leaks debug info in production** | `errorHandler.js:25` | 🟡 Medium | Line 25: `'Something went very wrong: ' + err.message + ' (Debug)'` — in production mode, non-operational errors still expose `err.message` to clients. |
| 11 | **Order creation doesn't verify product stock** | `orderController.js:31-42` | 🟡 Medium | Orders are created without checking if products are in stock. No stock decrement on purchase. |
| 12 | **Newsletter form is mock — no real subscriber storage** | `layout.js:1387-1390` | 🟡 Medium | `USE_MAILCHIMP: false` — newsletter always shows success but emails go nowhere. |

### Low Bugs

| # | Bug | File | Severity | Reproduction |
|---|---|---|---|---|
| 13 | **`api/_lib/auth.js` is empty (2 bytes)** | `api/_lib/auth.js` | 🟢 Low | Dead file — appears to be a leftover Vercel serverless stub. No functional impact. |
| 14 | **`comparePrice` validator only works on new documents** | `Product.js:33` | 🟢 Low | The comment says `this only points to current doc on NEW document creation`. Price validation won't run on updates. |
| 15 | **Console.log statements left in production code** | `layout.js:34`, multiple | 🟢 Low | `console.log('[API Request]...')` logs every API request to browser console. Should be removed for production. |
| 16 | **`hpp` whitelist includes `difficulty`** | `server.js:54` | 🟢 Low | The `difficulty` field doesn't exist in any model — leftover from a tutorial template. |

---

## 10. MISSING FEATURES & IMPROVEMENTS

### Must-Have for a Real Premium Jewelry Store

| Feature | Priority | Details |
|---|---|---|
| **Real product images** | 🔴 Critical | All images are generic Unsplash stock photos. A premium jewelry brand NEEDS real product photography. |
| **Admin dashboard UI** | 🔴 Critical | No admin panel exists. Store owner has zero way to manage products, orders, or analytics without direct database access. |
| **Server-side product loading** | 🔴 Critical | Frontend should fetch products from `GET /api/products` instead of hardcoded `products.js`. This defeats the entire purpose of having a backend. |
| **Stock management** | 🟠 High | No stock decrement on purchase. No "out of stock" state. No inventory tracking. |
| **Order confirmation email to customer** | 🟠 High | Currently only the business owner gets an email. The customer receives nothing. |
| **Payment gateway setup** | 🟠 High | Razorpay key is a placeholder. Online payments are non-functional. |
| **Invoice generation** | 🟠 High | No PDF invoice generation or downloadable receipts. |
| **Email verification** | 🟠 High | No email verification on signup. Anyone can create an account with any email. |
| **Order cancellation** | 🟠 High | Users cannot cancel orders. No cancel button or API endpoint. |
| **Reviews & ratings** | 🟡 Medium | Schema has `ratingsAverage` and `ratingsQuantity` but no review submission functionality. |
| **Product image upload** | 🟡 Medium | No image upload system — all images are external URLs. Admin would need Cloudinary/S3 integration. |
| **Search from API** | 🟡 Medium | Search is client-side only from hardcoded array. Should use the text index on Product model. |
| **Pagination** | 🟡 Medium | `getAllProducts` returns ALL products with no pagination. Will break at scale. |
| **Coupon system (server-side)** | 🟡 Medium | Promo codes are client-side only. Need a Coupon model + server validation. |
| **Edit profile** | 🟡 Medium | Users cannot change name/email. No profile editing. |
| **Change password** | 🟡 Medium | No password change from account settings (only reset via email). |
| **Return/refund flow** | 🟡 Medium | Status enum includes `'Returned'` but no UI or process for returns. |
| **Order status updates** | 🟡 Medium | Tracking is simulated based on order age. No real status updates by admin. |
| **Product variants (size/color)** | 🟡 Medium | No variant system. Every product is one-size. |
| **SSL/HTTPS enforcement** | 🟢 Low | Handled by Vercel but no explicit redirect in code. |
| **Sitemap.xml** | 🟢 Low | No sitemap for SEO. |
| **robots.txt** | 🟢 Low | No robots.txt. |
| **PWA support** | 🟢 Low | No service worker or manifest for offline/installable experience. |

---

## 11. SECURITY AUDIT

### 🔴 Critical Issues

| Issue | Details | Fix |
|---|---|---|
| **Live secrets committed to repository** | `.env` file contains real MongoDB URI, JWT secret, Resend API key. `seedAdmin.js` contains different hardcoded credentials. | Add `.env` to `.gitignore` (it IS listed but the file was committed before). Rotate ALL secrets immediately. Remove hardcoded URIs from `seedAdmin.js`. |
| **Admin credentials in source code** | `seedAdmin.js:42` → password `Southery2024`, `migrateProducts.js:44` → password `adminpassword123`. | Use environment variables. Rotate admin password. |

### 🟠 High Issues

| Issue | Details | Fix |
|---|---|---|
| **Default JWT secret fallback** | `auth.js:17` and `authController.js:19` both fall back to `'default_secret_for_boutique_auth_testing_123'` if env var is missing. | Remove fallback. Crash on startup if `JWT_SECRET` is not set. |
| **Price manipulation possible** | Checkout sends `totalPrice` from frontend. Backend trusts it without recalculating. | Backend should recalculate prices from product DB. Never trust client-sent prices. |
| **No CSRF protection** | No CSRF tokens on any form. | Add `csurf` middleware or implement same-site cookie tokens. |
| **API rate limiter disabled** | `apiLimiter` is commented out on line 41 of `server.js`. | Re-enable immediately. |
| **`POST /api/orders` is unprotected** | Any unauthenticated request can create orders with arbitrary data. | Add validation, reCAPTCHA, or honeypot. Verify product existence and prices server-side. |

### 🟡 Medium Issues

| Issue | Details | Fix |
|---|---|---|
| **No input length limits on order fields** | `guestName`, `shippingAddress.address`, etc. have no maxlength on the backend. | Add Mongoose `maxlength` validators to all string fields. |
| **XSS in search results** | `handleSearch()` in `layout.js:596` injects `query` directly into innerHTML without sanitization: `"${query}"`. | Sanitize or use `textContent`. |
| **Error messages leak implementation details** | Production error handler appends `err.message + ' (Debug)'`. | Remove `+ ' (Debug)'` and `err.message` from production error responses. |
| **No Helmet CSP configuration** | `helmet()` is used with defaults but no Content-Security-Policy customization. | Configure CSP to restrict script sources, image sources, etc. |

### ✅ Good Security Practices Found

- ✅ `bcryptjs` with 12 rounds for password hashing
- ✅ `express-mongo-sanitize` for NoSQL injection prevention
- ✅ `xss-clean` middleware active
- ✅ `hpp` for parameter pollution prevention
- ✅ `helmet` for security headers
- ✅ Password field `select: false` in User model
- ✅ Auth rate limiter on `/api/auth` (10 req/min)
- ✅ Contact form rate limiter (3/day)
- ✅ Forgot password always returns success (prevents email enumeration)
- ✅ Honeypot field on contact form
- ✅ CORS restricted to specific origins
- ✅ JWT expiry check with graceful session recovery
- ✅ `trust proxy` enabled for Vercel rate limiting

---

## 12. PERFORMANCE AUDIT

### Images

| Issue | Severity | Details |
|---|---|---|
| **All images from Unsplash CDN** | 🟡 Medium | External CDN — no control over caching. Images are loaded with `?w=800&q=80` which is reasonable. |
| **No WebP/AVIF format** | 🟡 Medium | All images are JPEG via Unsplash. Modern formats would reduce size 30-50%. |
| **No lazy loading on all images** | ✅ Good | Most images use `loading="lazy"` attribute. |
| **No image srcset/sizes** | 🟡 Medium | Same 800px image served to all viewports. Mobile devices download unnecessarily large images. |

### JavaScript

| Issue | Severity | Details |
|---|---|---|
| **`layout.js` is 79KB (1588 lines)** | 🟠 High | Single monolithic file handles everything: sidebars, cart, auth, search, toasts, cursor, scroll animations. Should be split into modules. |
| **`tailwind.css` is 69KB** | 🟡 Medium | Could be reduced by purging more aggressively. Still reasonable for Tailwind. |
| **Render-blocking JS** | 🟡 Medium | `products.js` and `layout.js` are loaded in `<head>` on checkout.html (lines 19-20) without `defer` or `async`. |
| **No code splitting or minification** | 🟡 Medium | `layout.js` and `styles.css` are not minified for production. |
| **Intersection Observer per page** | ✅ Good | Scroll reveal animations use IntersectionObserver, not scroll events. |

### API & Network

| Issue | Severity | Details |
|---|---|---|
| **Session validation on every page load** | 🟡 Medium | `loadUserFromServer()` calls `GET /api/auth/me` on every page load + fetches cart + wishlist. That's 3 API calls per page. |
| **Products not cached** | 🟡 Medium | No service worker, no cache headers, no stale-while-revalidate strategy. |
| **No CDN for static assets** | ✅ OK | Vercel provides edge CDN automatically for static sites. |

### CSS

| Issue | Severity | Details |
|---|---|---|
| **Two large CSS files** | 🟡 Medium | `styles.css` (31KB) + `tailwind.css` (69KB) = 100KB CSS total. |
| **Duplicate style declarations** | 🟢 Low | `.site-header` transitions defined in 3 places across `styles.css`. |
| **Custom cursor JS runs on every mousemove** | 🟢 Low | `requestAnimationFrame` loop for cursor follower — minor CPU cost. Only runs on desktop >1024px. |

### ✅ Good Performance Practices

- ✅ `loading="lazy"` on most images
- ✅ `will-change-transform` on sidebar animations
- ✅ IntersectionObserver for scroll animations
- ✅ Google Fonts loaded with `display=swap`
- ✅ SVG favicon (tiny file)
- ✅ No jQuery or heavy frameworks
- ✅ `json({ limit: '10kb' })` body parser limit

---

## 13. OVERALL RATING

| Category | Rating | Justification |
|---|---|---|
| **UI/UX Design** | **8/10** | Genuinely premium aesthetic. Luxury cursor, smooth animations, cohesive color palette (terracotta + sage + cream), premium typography. Category carousel is impressive. Toast system is polished. Mobile bottom nav is well-executed. Loses points for stock Unsplash images that undermine the "premium" feel, and some interactive elements (carousel dots) being too small on mobile. |
| **Frontend Code Quality** | **6/10** | Functional but has significant structural issues. `layout.js` is a 1588-line monolith with no modules, bundler, or build system for JS. Product data is hardcoded instead of fetched from API. HTML pages have extensive duplication (nav/footer copy-pasted). Tailwind is used well. CSS custom properties are thoughtful. Search uses `innerHTML` with unsanitized input. |
| **Backend Code Quality** | **7/10** | Well-structured MVC pattern. Good separation of concerns (controllers, routes, middleware, models). Proper error handling with operational/programming error distinction. Rate limiting, input validation via `express-validator` on signup. Loses points for: disabled API rate limiter, no stock management on orders, no server-side price validation, order tracking is simulated not real. |
| **Security** | **3/10** | Multiple critical failures: live secrets committed to git (MongoDB URI, JWT secret, API keys), admin credentials hardcoded in source, default JWT fallback secret, client-side-only price calculation, disabled rate limiter, no CSRF protection, XSS in search. Some good practices exist (bcrypt, helmet, sanitize, honeypot) but the exposed secrets alone warrant a critical rating. |
| **Performance** | **7/10** | Lightweight stack (no heavy frameworks), lazy loading images, IntersectionObserver animations, reasonable bundle sizes. Loses points for: 3 API calls per page load, 79KB monolithic JS file, no code splitting, no service worker, no image optimization (WebP/srcset). Vercel's edge CDN helps significantly. |
| **Responsiveness** | **8/10** | Excellent mobile support. Custom breakpoint at 400px (`xs`). iOS zoom fix. Safe area insets. Mobile-specific checkout simplifications (hidden footer/bottom-nav). Touch-friendly sidebars. Minor issues: carousel dots too small, cart quantity buttons slightly below 44px target. |
| **Feature Completeness** | **5/10** | Core e-commerce flow works (browse → cart → checkout → order). Auth, wishlist, contact form, and order tracking all function. But: no admin panel, no real payment gateway, products are hardcoded, no stock management, no customer order emails, no reviews, no returns flow, no search from API, newsletter is mock. Several "premium" features are surface-level only. |
| **Overall** | **6/10** | Southery Sentie demonstrates strong UI/UX sensibility and a solid backend architecture foundation. The design is genuinely premium-feeling for a student/portfolio project. However, it falls short of being a real, trustable e-commerce store due to critical security issues (exposed secrets), hardcoded product data (bypassing the entire backend), no admin interface, mock features (newsletter, payment), and missing essential e-commerce features (stock management, customer emails, invoices). With the security issues fixed, real product integration, and an admin panel, this could be a very strong production-ready jewelry store. |

---

## Quick Start

### Prerequisites
- Node.js ≥18
- MongoDB Atlas account
- Razorpay account (for online payments)
- Resend.com account (for transactional emails)

### Backend Setup
```bash
cd southery-backend
npm install
cp .env.example .env  # Fill in your values
npm run dev            # Starts on port 5000
```

### Frontend Setup
```bash
cd southery-website
npm install
npm run watch:css      # Watch Tailwind changes (separate terminal)
npm run dev            # Starts local server on port 5500
```

### Seed Database
```bash
cd southery-backend
node migrateProducts.js   # Seeds 24 products + mock orders
node seedAdmin.js         # Creates admin@southery.com / Southery2024
```

### Deploy
Both projects deploy to Vercel:
```bash
npx vercel --prod
```

---

*Last audited: June 2026 — by Senior Full-Stack Developer*
