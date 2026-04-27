# ShopElite — Full-Stack E-Commerce Platform

A professional-grade e-commerce application built with React 18, Node.js, MongoDB, Stripe payments, and Cloudinary image uploads.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Redux Toolkit, React Router v6 |
| Styling | Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens), bcrypt |
| Payments | Stripe Checkout |
| Images | Cloudinary + Multer |
| Email | Nodemailer (Gmail SMTP) |
| Charts | Recharts |

---

## 📁 Project Structure

```
E-Commerce(Pro)/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── components/         # Navbar, Footer, ProductCard, CartDrawer, etc.
│       ├── pages/              # Home, Products, Cart, Checkout, Orders, Admin/...
│       ├── store/              # Redux store + slices
│       ├── services/           # Axios instance + interceptors
│       ├── hooks/              # useAuth, useCart, useDebounce
│       └── utils/              # helpers (formatPrice, formatDate, etc.)
└── server/                     # Express backend
    ├── controllers/            # auth, product, cart, order, payment, admin
    ├── models/                 # User, Product, Cart, Order
    ├── routes/                 # auth, product, cart, order, payment, admin
    ├── middleware/             # auth, errorHandler
    ├── utils/                  # generateToken, sendEmail, cloudinary
    ├── seed.js                 # Database seeder
    └── server.js               # App entry point
```

---

## ⚙️ Environment Setup

### Server `.env` (at `/server/.env`)

```env
NODE_ENV=development
PORT=5000

MONGO_URI=mongodb://localhost:27017/ecommerce_pro

JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

CLIENT_URL=http://localhost:5173
```

---

## 🛠️ Installation & Running

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Stripe account
- Cloudinary account
- Gmail with App Password

### 1. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure environment variables

Copy and fill in the `.env` file in `/server/` as shown above.

### 3. Seed the database

```bash
cd server
npm run seed
```

This creates:
- **Admin:** `admin@shopelite.com` / `Admin@123`
- **User:** `user@shopelite.com` / `User@123`
- **20 sample products**

### 4. Start the servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/refresh-token` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | — | List products (search, filter, sort, paginate) |
| GET | `/api/products/:id` | — | Get product detail |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/:id/reviews` | User | Add review |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart/add` | User | Add to cart |
| PUT | `/api/cart/update` | User | Update item qty |
| DELETE | `/api/cart/remove/:productId` | User | Remove item |
| DELETE | `/api/cart/clear` | User | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders/create` | User | Create order |
| GET | `/api/orders/my-orders` | User | Get my orders |
| GET | `/api/orders/:id` | User | Get order detail |
| GET | `/api/orders` | Admin | Get all orders |
| PUT | `/api/orders/:id/deliver` | Admin | Mark delivered |

### Payment
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payment/create-checkout-session` | User | Create Stripe session |
| POST | `/api/payment/webhook` | — | Stripe webhook |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/users` | Admin | All users |

---

## ✨ Features

- 🔐 **JWT Auth** — Access (15min) + Refresh (7d) tokens in httpOnly cookies
- 🛍️ **Product Management** — Search, filter by category/price/rating, sort, paginate
- 🛒 **Persistent Cart** — Stored in MongoDB, synced across devices
- 💳 **Stripe Payments** — Hosted checkout, webhook for order confirmation
- 📧 **Email Notifications** — Welcome email on register, order confirmation
- ☁️ **Cloudinary Uploads** — Drag-and-drop multi-image upload in admin
- ⭐ **Product Reviews** — 1-5 star ratings, one per user per product
- 📊 **Admin Dashboard** — Revenue charts (Recharts), order status pie, top products
- 🌙 **Dark Mode** — Full dark theme throughout
- 📱 **Responsive** — Mobile-first with hamburger nav

---

## 🎨 Demo Credentials

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopelite.com | Admin@123 |
| User | user@shopelite.com | User@123 |

---

## 📝 Stripe Testing

Use Stripe test card: `4242 4242 4242 4242` · Any future expiry · Any CVC

For webhook testing locally, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```
