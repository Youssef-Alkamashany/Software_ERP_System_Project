# ERP System — Node.js Backend

REST API built with **Express.js + MySQL** for the ERP frontend project.

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
cd erp-backend
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

### 3. Create the database
```bash
mysql -u root -p < src/config/schema.sql
```

### 4. Run the server
```bash
npm run dev    # Development (nodemon)
npm start      # Production
```

Server runs on: `http://localhost:5000`

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT |
| GET  | `/api/auth/me` | Get current user (🔒) |

### Products (Inventory)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/products` | Get all products with status |
| GET    | `/api/products/:id` | Get single product |
| POST   | `/api/products` | Create product (🔒 admin) |
| PUT    | `/api/products/:id` | Update product (🔒 admin) |
| DELETE | `/api/products/:id` | Delete product (🔒 admin) |
| PATCH  | `/api/products/:id/restock` | Add stock units (🔒 admin/warehouse) |

### Orders (Sales / POS)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/orders` | Get all orders (🔒) |
| GET    | `/api/orders/:id` | Get order + items (🔒) |
| POST   | `/api/orders` | Process checkout → auto-deducts inventory (🔒) |
| PATCH  | `/api/orders/:id/cancel` | Cancel order + restore stock (🔒 admin) |

### Stock Logs (Audit Trail)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/stock-logs` | Get stock history (🔒 admin/warehouse) |
| GET    | `/api/stock-logs?product_id=1` | Filter by product |
| GET    | `/api/stock-logs?type=sale` | Filter by type (sale/restock/adjustment) |

---

## 🔑 Authentication

Send JWT token in every protected request:
```
Authorization: Bearer <your_token>
```

Default admin credentials (from seed):
- Email: `admin@erp.com`
- Password: `admin123`

---

## 📦 Request Examples

### Login
```json
POST /api/auth/login
{
  "email": "admin@erp.com",
  "password": "admin123"
}
```

### Process Order (Checkout)
```json
POST /api/orders
Authorization: Bearer <token>
{
  "cart": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}
```

### Restock Product
```json
PATCH /api/products/1/restock
Authorization: Bearer <token>
{
  "amount": 10
}
```

---

## 🗂️ Project Structure

```
erp-backend/
├── src/
│   ├── config/
│   │   ├── db.js           # MySQL connection pool
│   │   └── schema.sql      # Database schema + seed data
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── stockLogController.js
│   ├── middleware/
│   │   └── auth.js         # JWT authenticate + role authorize
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── stockLogRoutes.js
│   └── server.js           # Express app entry point
├── .env.example
├── .gitignore
└── package.json
```

## 🔗 Connect Frontend

In your React project, set the API base URL:
```js
const API = 'http://localhost:5000/api';
```

Replace `fetch` calls like:
```js
// Get products
const res = await fetch(`${API}/products`);

// Process order
const res = await fetch(`${API}/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ cart })
});
```
