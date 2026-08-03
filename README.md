# 🚀 Enterprise Resource Planning (ERP) System
> **An end-to-end, multi-module ERP solution with a Node.js/MySQL REST API & React Frontend, engineered for real-time inventory synchronization and automated order workflows.**

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 🌟 System Overview & Core Integration Logic
The core engineering value of this ERP platform is the **real-time synchronization** between two core enterprise operations:
1. **Inventory Management Module:** Centralized repository for product cataloguing, dynamic pricing, and stock monitoring.
2. **Sales / POS Module:** Transaction engine for cart handling, checkout processing, and customer order fulfillment.

> **🔄 Synchronized Integration:** Any checkout completed in the Sales module triggers an immediate, ACID-compliant stock deduction in the Inventory database, logging an automated audit trail.

---

## 🏗️ Software Engineering Lifecycle (SDLC)

### 📑 Phase 1: Analysis & System Architecture (The Blueprint)
* **Software Requirements Specification (SRS):** Full technical requirement baseline.
* **UML Modeling:** Architectural design via Use Case, Class, Sequence, and Activity Diagrams (utilizing **Fork & Join** nodes for concurrent workflow processes).
* **Database Design:** Relational ERD and normalized MySQL schema (`schema.sql`).

---

### 🛠️ Phase 2: System Implementation
* **Frontend:** Built with **React** & **Tailwind CSS**, leveraging Hooks (`useState`, `useEffect`) for state management and live cart status calculations.
* **Backend:** Scalable RESTful API engineered with **Express.js** and **MySQL connection pooling**.
* **Logic Rules:** Automated stock health categorization (`Healthy`, `Low Stock`, `Out of Stock`).
  
---

### 🧪 Phase 3: Quality Assurance
* **Testing Execution:** Functional Test Cases covering zero-stock validations, concurrent checkout operations, and role authorization limits.

---

## ⚡ Quick Start (Backend Setup)

### 1. Install dependencies
```bash
cd erp-backend
npm install

```



### 2. Configure Environment & Database

```bash
cp .env.example .env
# Set your MySQL credentials inside .env
mysql -u root -p < src/config/schema.sql

```



### 3. Run the Server

```bash
npm run dev    # Development Mode
npm start      # Production Server

```

> Server runs locally on: `http://localhost:5000`

---

## 📋 API Endpoints Reference

### 🔒 Auth

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **POST** | `/api/auth/register` | Register a new user | Public |
| **POST** | `/api/auth/login` | Authenticate user & return JWT | Public |
| **GET** | `/api/auth/me` | Fetch active user profile | Authorized |



### 📦 Products (Inventory)

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **GET** | `/api/products` | Retrieve all products with status | Public |
| **GET** | `/api/products/:id` | Retrieve single product details | Public |
| **POST** | `/api/products` | Create a new product | Admin |
| **PUT** | `/api/products/:id` | Update product information | Admin |
| **DELETE** | `/api/products/:id` | Remove a product | Admin |
| **PATCH** | `/api/products/:id/restock` | Restock inventory units | Admin / Warehouse |



### 🛒 Orders (Sales / POS)

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **GET** | `/api/orders` | List order transactions | Authorized |
| **GET** | `/api/orders/:id` | Retrieve order breakdown | Authorized |
| **POST** | `/api/orders` | Checkout → Deducts inventory stock | Authorized |
| **PATCH** | `/api/orders/:id/cancel` | Cancel order & restore stock | Admin |



### 📜 Stock Logs (Audit Trail)

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| **GET** | `/api/stock-logs` | Retrieve full stock audit history | Admin / Warehouse |

---

## 📦 Request Payload Examples

### 🔐 Authentication Request

```json
POST /api/auth/login
{
  "email": "admin@erp.com",
  "password": "admin123"
}

```



### 💳 Process Checkout Transaction

```json
POST /api/orders
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "cart": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}

```

---

## 🗂️ Project Repository Structure

```text
├── Documentation/        # SRS, UML Diagrams (Activity, Sequence, Use Case, ERD)
├── erp-backend/          # Node.js/Express REST API Core
│   ├── src/
│   │   ├── config/       # Database connection pool & schema.sql
│   │   ├── controllers/  # Business logic execution
│   │   ├── middleware/   # JWT authentication & Role authorization
│   │   └── routes/       # Express REST endpoints
│   └── server.js         # Express app root entry point
├── Source_Code/          # React & Tailwind Frontend Modules
└── Testing/              # Test Strategy, Test Cases, and Verification Reports

```

---

## 👤 Author & Contact

**Youssef Alkamashany**

* 🚀 **Aspiring MLOps/LLMOps & AI Data Engineer**.
* 💼 Team Leader — Microsoft Data Engineering | Digital Egypt Pioneers Initiative (DEPI).

---

> **"Architecting resilient systems where data integrity meets seamless business execution." 💼⚙️**

---
