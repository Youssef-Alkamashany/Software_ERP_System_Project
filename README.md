<<<<<<< HEAD
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
=======
# 🚀 Software ERP System: Integrated Sales & Inventory Logic
> **A robust, multi-module ERP solution demonstrating seamless system integration, advanced workflow orchestration, and full Software Development Lifecycle (SDLC) engineering.**

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![UML](https://img.shields.io/badge/Documentation-UML_&_SRS-blue?style=for-the-badge)

</div>

---

### 🌟 Project Concept (System Integration)
The core of this project is the **automated synchronization** between two critical business modules:
1. **Inventory Management System:** Centralized hub for product registration, pricing, and real-time stock monitoring.
2. **Sales (POS) System:** High-performance interface for processing customer orders and transactions.
* **The Integration Logic:** A synchronized workflow where any transaction in the Sales module triggers an automatic, real-time stock deduction in the Inventory module.

---

### 📑 Phase 1: Analysis & Design (The Blueprint)
* **SRS (Software Requirements Specification):** Technical roadmap defining all functional operations.
* **UML Modeling:** Includes Use Case, Class, Sequence, and Activity Diagrams (utilizing **Join** and **Fork** nodes for concurrent processes).
* **ERD & Architecture:** Logical database schema design and high-level system mapping.

---

### 🛠️ Phase 2: Implementation & Engineering
* **Frontend Architecture:** Built with **React** and styled with **Tailwind CSS**.
* **Core Logic:** Developed using **JavaScript (ES6+)** for dynamic data handling, array manipulation, and state management.
* **State Management:** Leveraging React Hooks (`useState`, `useEffect`) for live cart calculations and inventory health status.
* **Logic Engineering:** Automated stock alerts (`Healthy`, `Low Stock`, `Out of Stock`).

---

### 🧪 Phase 3: Quality Assurance (Testing)
* **Test Plan & Cases:** Testing edge cases like "Zero Stock" scenarios.
* **Integration Testing:** Verifying communication accuracy between Sales and Inventory modules.
-----------------------------
### 👤 Author
**Youssef Alkamashany**
* 🚀 **Aspiring MLOps/LLMOps & AI Data Engineer**.
* 💼 Team Leader — Microsoft Data Engineering | Digital Egypt Pioneers Initiative (DEPI).

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/youssef-alkamashany-18261132b)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Youssef-Alkamashany)
---

### 📂 Deliverables (Submission Package)
```text
├── Documentation/       # SRS, UML Diagrams (Activity, Sequence, Use Case, ERD)
├── Database/            # Logical Schema Design & Data Models
├── Source_Code/         # React & JavaScript Logic Engines
├── Testing/             # Test Plan, Test Cases, and Quality Reports
└── Presentation/        # Final Technical Report & Project Demo
>>>>>>> 2fc10b551125325c89500d97c537919670225061
