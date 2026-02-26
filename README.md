# Food Delivery Web App

A full-stack food delivery platform where users browse a menu, add items to a cart, and complete checkout via Stripe.

---

## Problem → Solution → Results

### Problem
- **Manual ordering friction**: No simple way to browse a menu, build a cart, and pay online in one flow
- **Cart persistence**: Losing cart items on refresh or when switching devices
- **Secure payments**: Need a trusted payment flow without handling card data directly

### Solution
- **Single-page app** with React + Vite for fast browsing and category filtering
- **Hybrid cart strategy**: localStorage for guests; MongoDB sync for logged-in users so the cart persists across sessions
- **Stripe Checkout** for PCI-compliant payment handling via redirect flow

### Results
| Metric | Outcome |
|--------|---------|
| Dev experience | Vite HMR keeps changes visible in < 1s |
| Checkout flow | One redirect to Stripe, then back to verify page |
| Cart persistence | Logged-in users keep cart across devices/sessions |
| Auth | JWT + bcrypt + validation (email, strong password) |

---

## Role & Key Decisions

### Role
Full-stack development: backend API, database modeling, auth, payment integration, and frontend UI/UX.

### Tech Stack
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React 19 + Vite | Fast HMR, modern tooling; Vite over CRA for build speed |
| Backend | Node.js + Express 5 | REST API, familiar ecosystem, easy to extend |
| Database | MongoDB + Mongoose | Flexible schema for cart/orders, simple deployment |
| Auth | JWT + bcrypt | Stateless auth, no sessions, works well with SPA |
| Payment | Stripe Checkout | Redirect flow, no PCI scope, quick integration |

### Data Design
- **User**: `name`, `email`, `password` (hashed), `cartData` (embedded object: `{ itemId: qty }`)
- **Food**: `name`, `description`, `price`, `image`, `category`
- **Order**: `userId`, `items`, `amount`, `address`, `status`, `payment` (boolean after Stripe)

Embedding `cartData` in the user document keeps cart reads/writes simple and avoids extra collections.

### Auth Flow
- **Register**: Validate email (validator), enforce strong password; hash with bcrypt (salt 10); return JWT
- **Login**: Compare password with bcrypt; return JWT
- **Protected routes**: Middleware reads `token` from header, verifies JWT, attaches `userId` to `req.body`

### State Management
- **React Context** (`StoreContext`) for global state: `cartItems`, `foodList`, `token`
- Cart persisted in localStorage; on load, if token exists, cart is synced from MongoDB and overwrites localStorage

---

## Project Structure

```
food-del/
├── backend/           # Express API
│   ├── config/        # DB connection
│   ├── controllers/   # user, cart, food, order logic
│   ├── middleware/    # JWT auth
│   ├── models/        # User, Food, Order
│   └── routes/        # API endpoints
├── frontend/          # React + Vite
│   └── src/
│       ├── components/ # Navabar, FoodDisplay, LoginPopup, Footer
│       ├── context/   # StoreContext
│       └── pages/     # Home, Cart, PlaceOrder, Verify, MyOrders
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Stripe account

### Backend
```bash
cd backend
npm install
# Create .env with: MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY
npm run server
```
Server runs at `http://localhost:4000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173` (or 5174 depending on Vite config)

---

## API Overview
| Endpoint | Auth | Description |
|----------|------|-------------|
| `POST /api/user/register` | No | Register new user |
| `POST /api/user/login` | No | Login, returns JWT |
| `GET /api/food/list` | No | List all food items |
| `POST /api/cart/add` | Yes | Add item to cart |
| `POST /api/cart/remove` | Yes | Remove item from cart |
| `POST /api/cart/get` | Yes | Get user's cart |
| `POST /api/order/place` | Yes | Create order + Stripe session |
| `POST /api/order/verify` | No | Confirm payment after Stripe redirect |
| `POST /api/order/userorders` | Yes | Get user's order history |


