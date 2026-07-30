# 🍔 Food Delivery Service

A full-stack, multi-role food delivery platform built with **React + TypeScript** on the frontend and a **Node.js / Express / MongoDB** REST API on the backend. The system connects three types of users — **Customers**, **Restaurants**, and **Drivers** — around a single, real-world business workflow: browse restaurants, order food, prepare it, and get it delivered.

This project was built to demonstrate production-style full-stack engineering: role-based authentication, relational data modeling in MongoDB, order lifecycle management, and a clean separation between a typed REST API and a component-driven SPA.

---

## 📖 Overview

Food Delivery Service digitizes the core operations of an on-demand food delivery business:

- **Customers** discover restaurants by category, build a cart, checkout, track their order status, and rate their experience.
- **Restaurants** manage their menu, receive incoming orders, and move them through preparation until a driver is assigned.
- **Drivers** toggle their availability, pick up orders that are searching for a driver, and mark them as delivered.

Every order moves through a shared **status pipeline** (`Pending → In Preparation → Searching for driver → Out for Delivery → Delivered`) that keeps all three roles in sync from a single source of truth — the `Order` document in MongoDB.

---

## ✨ Features by User Role

### 🧑‍🍳 Customer
- Register/login with a dedicated customer account
- Browse restaurants and filter by **category**
- View a restaurant's menu, grouped by type (meals, appetizers, drinks)
- Add/update/remove items in a persistent **shopping cart**
- Checkout with **Cash** or **Credit Card** payment method
- Save, update, and delete multiple **delivery addresses**
- View order history with live order status and assigned driver info
- Rate the **restaurant** and the **driver** (1–5 stars) after delivery
- Manage account profile (name, phone number, password reset via emailed verification code)

### 🍽️ Restaurant
- Register with business details (name, phone, location, opening/closing hours, category, logo image upload)
- Manage restaurant profile (location, hours, delivery price)
- Full **menu management**: add, update, and delete menu items (with image, description, price, type)
- View incoming orders and filter them by status
- Move orders through the workflow: `Pending → In Preparation → Searching for driver`
- Build restaurant rating automatically from customer reviews (running average)

### 🚗 Driver
- Register with personal details (name, phone number)
- Toggle **availability** (Available / Not Available)
- View the pool of orders currently "Searching for driver"
- Accept a delivery, which locks the order to that driver and marks them unavailable
- Mark an active delivery as **Delivered**, which automatically frees the driver for new orders
- Update personal profile information

> **Note on Admin:** The codebase includes a single protected utility endpoint (`PUT /users/admin-reset-password`) for administrative password resets, but there is no dedicated Admin dashboard or Admin role in the current implementation.

---

## 🛠️ Technology Stack

### Frontend
- **React 19** + **TypeScript**
- **Vite** — build tool & dev server
- **React Router v7** — client-side routing
- **Ant Design (antd)** — UI component library
- **Tailwind CSS** — utility-first styling
- **Font Awesome** — icon set
- **Axios** — HTTP client
- **Day.js** — date handling
- **Context API** — cart state management (`cartcontext.tsx`)

### Backend
- **Node.js** + **Express 5**
- **TypeScript**
- **JWT (jsonwebtoken)** — stateless authentication via HTTP-only cookies
- **bcrypt** — password hashing
- **Multer** — image/file uploads (restaurant logos, etc.)
- **Nodemailer** — transactional email for password-reset verification codes
- **cookie-parser** / **cors** — request handling & cross-origin security

### Database
- **MongoDB** with **Mongoose ODM**
- Core collections: `User`, `Customer`, `Restaurant`, `Driver`, `MenuItem`, `Category`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Review`, `VerificationCode`

### Tools
- **Nodemon** + **ts-node** / **tsc -w** — backend hot-reload during development
- **Concurrently** — run TypeScript compiler and server watcher together
- **ESLint** — code linting (frontend)
- **Git** — version control

---

## 🏗️ System Architecture

The project follows a **decoupled client-server architecture**:

```
┌─────────────────────┐        REST API (JSON over HTTPS)        ┌──────────────────────┐
│   React + TS SPA     │  ───────────────────────────────────▶   │  Express + TS Server   │
│   (Vite, Port 5173)  │  ◀───────────────────────────────────   │   (Port 5000)          │
└─────────────────────┘        JWT via HTTP-only cookie          └──────────┬────────────┘
                                                                              │ Mongoose ODM
                                                                              ▼
                                                                   ┌──────────────────────┐
                                                                   │      MongoDB          │
                                                                   └──────────────────────┘
```

- **Authentication**: On login, the server issues a signed **JWT** stored in an `httpOnly` cookie. An `authenticate` middleware verifies the token on every protected route and attaches the user to `res.locals.user`.
- **Role separation**: A single `User` collection stores `email`, `password`, and `role` (`customer` | `restaurant` | `driver`). Each role has its own linked profile document (`Customer`, `Restaurant`, or `Driver`) referencing the base `User` via a `user` foreign key — a classic **base + profile table** pattern.
- **Order state machine**: The `Order` model enforces valid status transitions (`Pending → In Preparation → Searching for driver → Out for Delivery → Delivered`) through dedicated route handlers rather than free-form updates, keeping the business logic centralized on the server.
- **File uploads**: Restaurant images are handled through `multer` disk storage and served statically from `/uploads`.
- **Error handling**: A centralized `AppError` class plus custom/default Express error-handling middleware normalize API error responses.

---

## 📁 Project Folder Structure

```
Food-Delivery-Service/
├── backend/
│   ├── app.ts                     # Express app entry point & route mounting
│   ├── @types/                    # Shared TypeScript type definitions
│   └── src/
│       ├── config/                # DB connection (db.ts) & env loader (env.ts)
│       ├── Controllers/
│       │   ├── auth/              # Signup/login logic per role
│       │   ├── cartController.ts
│       │   ├── categoryController.ts
│       │   ├── customerController.ts
│       │   ├── driverController.ts
│       │   ├── menuController.ts
│       │   ├── orderController.ts
│       │   ├── passwordController.ts
│       │   └── restaurantController.ts
│       ├── middleware/
│       │   ├── auth/              # authenticate.ts, authorize.ts
│       │   ├── validation/        # request-body validators
│       │   ├── upload.ts          # multer config
│       │   └── errorHandler.ts
│       ├── models/                # Mongoose schemas (User, Order, Restaurant, etc.)
│       ├── routers/                # Express routers per resource
│       └── utils/                 # AppError, token generation, mail sender
│
├── frontend/
│   ├── components/                # Feature-based React components
│   │   ├── login/ · signUp/       # Auth screens
│   │   ├── home/ · FilterBar/     # Restaurant discovery
│   │   ├── MenuGrid/ · MenuItemCard/ · AddMenuItem/ · UpdateMenuItem/
│   │   ├── Cart/ · ConfirmOrder/
│   │   ├── RestaurantDashboardPage/ · MenuManagementPage/ · RestaurantsProfile/
│   │   ├── DriverIncomingOrdersPage/ · DriverOrderCard/ · DriverTopBar/
│   │   ├── profile/
│   │   │   ├── CustomerProfile/
│   │   │   ├── ManageRestaurantprofile/
│   │   │   └── delivery/          # Driver profile
│   │   ├── OrderCard/ · DashboardTopBar/ · Notification/ · TopBar/
│   ├── src/
│   │   ├── App.tsx                # Route definitions
│   │   ├── cartcontext.tsx        # Global cart state (Context API)
│   │   └── main.tsx               # App bootstrap
│   ├── public/ · assets/          # Static assets & images
│   └── types.ts                   # Shared frontend TypeScript types
│
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites
- **Node.js** ≥ 18
- **npm**
- A running **MongoDB** instance (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/israamaherzeer/Food-Delivery-Service-.git
cd Food-Delivery-Service-
```

### 2. Backend Setup
```bash
cd backend
npm install

# Compile TypeScript and run the server with hot-reload
npm run dev
```
The API server runs on **https://food-delivery-service-production.up.railway.app**.

Available scripts:
| Script | Description |
|---|---|
| `npm run dev` | Compiles TS (`tsc -w`) and runs the server with `nodemon` concurrently |
| `npm run build-tsc` | Compiles TypeScript to `dist/` in watch mode |
| `npm run run-watch` | Runs the compiled server with `nodemon` |
| `npm start` | Starts the compiled server (`./bin/www`) |

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The React app runs on **http://localhost:5173** (Vite default) and is pre-configured with CORS to talk to the backend on port `5000`.

### 4. Environment Variables
Create a `.env` file inside `backend/` with the following keys:

```env
# MongoDB connection string
MONGO_URL=mongodb://localhost:27017/food-delivery

# Secret used to sign & verify JWTs
SECRET_KEY=your_jwt_secret_key

# Nodemailer credentials for sending password-reset verification codes
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Environment mode (affects cookie security settings)
NODE_ENV=development
```

> ⚠️ The server currently listens on a hardcoded port (`5000`) in `app.ts` — update it there if you need a different port.

### 5. Database Setup
1. Ensure MongoDB is running locally, or provision a free cluster on **MongoDB Atlas**.
2. Set `MONGO_URL` in your `.env` file accordingly.
3. No manual migrations are required — Mongoose creates collections automatically the first time documents are written (e.g., on the first signup).

---

## 🔌 API Overview

All endpoints are prefixed by their router base path shown below. Protected routes require a valid `userToken` cookie (set automatically on login).

### Auth — `/users`
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/users/signup/customer` | Register a new customer | No |
| POST | `/users/signup/driver` | Register a new driver | No |
| POST | `/users/signup/restaurant` | Register a new restaurant (with image upload) | No |
| POST | `/users/login` | Login and receive a JWT cookie | No |
| POST | `/users/logout` | Clear the auth cookie | No |
| GET | `/users/profile` | Get the logged-in user's role-specific profile | Yes |
| POST | `/users/forget-password` | Request a password-reset verification code | No |
| PUT | `/users/reset-password` | Reset password using a verification code | No |
| PUT | `/users/password` | Change password (logged in) | Yes |

### Restaurants — `/restaurants`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/restaurants` | List all restaurants |
| GET | `/restaurants/category?category=` | Filter restaurants by category |
| GET | `/restaurants/id/:id` | Get a restaurant by ID |
| GET | `/restaurants/name?name=` | Get a restaurant by name |
| GET | `/restaurants/status/:id` | Get open/closed status |
| PUT | `/restaurants/profile` | Update restaurant profile *(protected)* |

### Menu — `/menu-items`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/menu-items` | List all menu items |
| POST | `/menu-items` | Add a menu item *(protected)* |
| PUT | `/menu-items/:id` | Update a menu item *(protected)* |
| DELETE | `/menu-items/:id` | Delete a menu item |

### Cart — `/api/cart`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get the customer's cart *(protected)* |
| POST | `/api/cart/add` | Add item to cart *(protected)* |
| POST | `/api/cart/update` | Update item quantity *(protected)* |
| DELETE | `/api/cart/:itemId` | Remove an item *(protected)* |
| DELETE | `/api/cart/clear` | Clear the cart *(protected)* |

### Orders — `/api/orders`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place a new order *(protected)* |
| GET | `/api/orders` | Get the logged-in customer's orders *(protected)* |
| GET | `/api/orders/restaurant-orders?status=` | Get a restaurant's orders, optionally filtered *(protected)* |
| PUT | `/api/orders/:id/preparation` | Restaurant: mark order "In Preparation" *(protected)* |
| PUT | `/api/orders/:id/searchingForDriver` | Restaurant: release order for driver pickup *(protected)* |
| PUT | `/api/orders/:id/rating` | Rate the restaurant or driver for an order |

### Driver — `/api/driver`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/driver/drivers/available` | List currently available drivers |
| GET | `/api/driver/orders` | Get orders relevant to the logged-in driver *(protected)* |
| PUT | `/api/driver/orders/:id/startDelivery` | Accept a delivery *(protected)* |
| PUT | `/api/driver/orders/:id/delivered` | Mark a delivery complete *(protected)* |
| GET | `/api/driver/availability` | Get current availability status *(protected)* |
| PUT | `/api/driver/availability` | Toggle availability *(protected)* |
| PUT | `/api/driver/profile` | Update driver profile *(protected)* |

### Categories & Customer Profile
- `GET/POST /categories` — list or create restaurant categories
- `PUT /customer-profile/users/:id` — update a customer's name/phone
- `GET/POST/PUT/DELETE /customer-profile/address` — manage saved addresses *(protected)*

---

## 🔄 User Workflow

### 1. How a Customer places an order
1. Browse restaurants on the home page, optionally filtered by category.
2. Open a restaurant profile and add menu items to the cart.
3. Review the cart, select a saved (or new) delivery address and a payment method (**Cash** or **Credit Card**).
4. Submit the order → `POST /api/orders` creates an `Order` (status: **Pending**) with linked `OrderItem` documents and calculates the total price (items + restaurant delivery fee).
5. Track the order's live status from the customer profile/order history.
6. Once delivered, rate the restaurant and driver (1–5 stars each).

### 2. How a Restaurant manages orders
1. Log in and land on the **Restaurant Dashboard**, which lists incoming orders (filterable by status).
2. Accept and start cooking an order → `PUT /:id/preparation` moves it from **Pending** to **In Preparation**.
3. When the food is ready, release it to the driver pool → `PUT /:id/searchingForDriver` moves it to **Searching for driver** and clears any prior driver assignment.
4. Manage the menu independently at any time (add/edit/delete items, adjust delivery price and business hours).

### 3. How a Driver delivers orders
1. Toggle **availability** to "Available" to start receiving delivery opportunities.
2. View the incoming orders page, which shows orders currently **Searching for driver**.
3. Accept a delivery → `PUT /orders/:id/startDelivery` assigns the order to that driver, sets status to **Out for Delivery**, and marks the driver unavailable (so they can't double-book).
4. Complete the delivery → `PUT /orders/:id/delivered` sets the order to **Delivered** and automatically frees the driver to accept new orders again.

---

## 📸 Screenshots

> Add screenshots or GIFs of the running application here to showcase the UI.

| Home / Restaurant Discovery | Restaurant Menu | Cart & Checkout |
|---|---|---|
| _[screenshot placeholder]_ | _[screenshot placeholder]_ | _[screenshot placeholder]_ |

| Restaurant Dashboard | Menu Management | Driver Incoming Orders |
|---|---|---|
| _[screenshot placeholder]_ | _[screenshot placeholder]_ | _[screenshot placeholder]_ |

---

## 🚀 Future Improvements

- Introduce a dedicated **Admin role and dashboard** for platform-wide oversight (users, restaurants, disputes)
- Add **real-time order tracking** with WebSockets (e.g., Socket.IO) instead of polling
- Integrate a real **payment gateway** (Stripe/PayPal) for credit card transactions
- Add **live map-based driver tracking** for customers
- Implement **automated tests** (unit/integration) for controllers and React components
- Add **pagination and search** to restaurant and menu listings
- Externalize the hardcoded server port and CORS origin into environment variables
- Add **rate limiting** and request validation hardening for production readiness

---

## 👩‍💻 Author

Developed as a full-stack portfolio project demonstrating role-based application design, REST API architecture, and end-to-end order-management workflows using the **React + TypeScript + Node.js + Express + MongoDB** stack.

Feel free to reach out for collaboration, freelance work, or questions about the implementation.

- **GitHub Repository:** [Food-Delivery-Service](https://github.com/israamaherzeer/Food-Delivery-Service-)

---

⭐ If you found this project useful or interesting, consider giving it a star on GitHub!
