# 💎 Southery Sentie — Premium Handcrafted Jewelry

A modern, high-performance e-commerce website for **Southery Sentie**, a premium handcrafted jewelry brand. Built with clean HTML5, Vanilla JavaScript, and Tailwind CSS.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher) — required for Tailwind CSS compilation only
- A backend server running at `http://localhost:3000` for authentication and order features (see [Backend Setup](#-backend))

### Installation

1. **Clone or download** this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Watch for CSS changes and auto-rebuild:
```bash
npm run watch:css
```

Open `index.html` with a local server (e.g. VS Code Live Server on port 5500).

### Build for Production

Compile and minify the final CSS:
```bash
npm run build:css
```

> **Note:** The compiled CSS (`css/tailwind.css`) is already included so you can open the site directly without running any build step.

---

## 📂 Project Structure

```
southery-website/
├── index.html              # Homepage
├── shop.html               # Shop / Product Grid
├── product.html            # Product Detail Page
├── cart.html               # Shopping Cart
├── checkout.html           # Checkout Flow
├── wishlist.html           # Wishlist Page
├── account.html            # Customer Account & Auth
├── order-tracking.html     # Order Tracking
├── done.html               # Payment & Order Confirmation Success
├── about.html              # About Us
├── contact.html            # Contact Page
├── faq.html                # FAQ
├── care-guide.html         # Jewelry Care Guide
├── shipping.html           # Shipping & Returns Policy
├── privacy.html            # Privacy Policy
├── terms.html              # Terms & Conditions
├── 404.html                # Custom 404 Page
│
├── css/
│   ├── tailwind.css        # Compiled Tailwind CSS (auto-generated)
│   └── styles.css          # Custom styles & overrides
│
├── js/
│   ├── layout.js           # Global navigation, cart, wishlist, auth, modals
│   └── products.js         # Product data & catalog (32 items)
│
├── src/
│   └── input.css           # Tailwind CSS source (build input)
│
├── favicon.svg
├── tailwind.config.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5, Semantic Elements |
| Styling | Tailwind CSS v3 (local build) + Custom CSS |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Cormorant Garamond, Montserrat (Google Fonts) |
| Icons | Inline SVG icons |
| Storage | localStorage (cart, wishlist, auth token) |

---

## ✨ Features

- 🛒 **Full Cart & Wishlist** — Add, remove, quantity management with localStorage persistence
- 🔍 **Live Search** — Real-time product search with animated modal
- 🎛 **Advanced Filtering** — Filter by category, collection, price range, and sort
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- 🧾 **Checkout Flow** — Multi-step checkout with address and payment forms
- 📦 **Order Tracking** — Real-time order status tracker with shipment timeline
- 🔐 **Authentication** — Login, signup, and Google OAuth integration
- 👤 **Account Dashboard** — Order history, saved addresses, profile settings
- ♾ **Infinite Scroll** — Progressive product loading on shop page
- ⚡ **Performance** — Lazy loaded images, minified CSS, no external JS frameworks
- 🌐 **SEO Ready** — Meta tags, semantic HTML, proper heading hierarchy

---

## 📸 Pages Overview

| Page | Description |
|------|-------------|
| `index.html` | Homepage with hero, featured products, collections |
| `shop.html` | Full product catalog with filters and infinite scroll |
| `product.html` | Individual product detail with image gallery |
| `cart.html` | Shopping cart with quantity controls and sticky order summary |
| `checkout.html` | Multi-step checkout with address and payment |
| `wishlist.html` | Saved/liked products |
| `account.html` | Customer login, signup, and account dashboard |
| `order-tracking.html` | Live order status tracker with timeline |
| `done.html` | Order success & confirmation page |
| `about.html` | Brand story |
| `contact.html` | Contact form and boutique info |
| `faq.html` | Frequently asked questions with search and filters |
| `care-guide.html` | Jewelry care tips and instructions |
| `shipping.html` | Shipping and returns policy |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms and conditions |
| `404.html` | Custom 404 error page |

---

## 🔗 Backend

This frontend connects to a separate Node.js/Express backend for:
- User authentication (login, signup, JWT tokens)
- Order management and history
- Newsletter subscriptions
- Contact form submissions

The backend should be running at `http://localhost:3000`. See the backend repository for setup instructions.

---

## 🔧 Customization

### Adding Products

Edit `js/products.js` — each product follows this structure:

```js
{
  id: 1,
  name: "Product Name",
  price: 1299,
  comparePrice: 1799,       // Optional — shows strikethrough
  category: "ring",          // "ring" | "necklace" | "earring" | "bracelet"
  collection: "handmade",   // "handmade" | "anti-tarnish"
  image: "https://...",
  stock: 10,
  description: "..."
}
```

### Modifying Styles

- **Tailwind classes** → edit directly in HTML, then run `npm run build:css`
- **Custom CSS** → edit `css/styles.css` (no build step needed)
- **Color palette** → edit `tailwind.config.js`

### Color Palette

| Token | Color | Usage |
|-------|-------|-------|
| `terracotta` | `#C45C26` | Primary brand color, CTAs, accents |
| `charcoal` | `#2D312B` | Text, dark backgrounds |
| `cream` | `#FAF8F5` | Page backgrounds |
| `sage` | `#7C8C6E` | Secondary accent, success states |

---

## 📄 License

© 2026 Southery Sentie. All rights reserved.
