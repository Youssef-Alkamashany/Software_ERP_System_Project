-- ============================================
--   ERP System Database Schema
--   Matches: Sales (POS) + Inventory Modules
-- ============================================

CREATE DATABASE IF NOT EXISTS erp_system;
USE erp_system;

-- ─────────────────────────────────────────
-- USERS TABLE (for authentication)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin', 'cashier', 'warehouse') DEFAULT 'cashier',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- PRODUCTS TABLE (Inventory)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  price       DECIMAL(10, 2) NOT NULL,
  stock       INT NOT NULL DEFAULT 0,
  low_stock_threshold INT DEFAULT 10,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- ORDERS TABLE (Sales)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  total       DECIMAL(10, 2) NOT NULL,
  status      ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
  cashier_id  INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────
-- ORDER ITEMS TABLE (Sales Line Items)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    INT NOT NULL,
  product_id  INT NOT NULL,
  quantity    INT NOT NULL,
  unit_price  DECIMAL(10, 2) NOT NULL,
  subtotal    DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- ─────────────────────────────────────────
-- STOCK LOGS TABLE (Audit Trail)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stock_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  product_id  INT NOT NULL,
  change_type ENUM('restock', 'sale', 'adjustment') NOT NULL,
  quantity    INT NOT NULL,        -- positive = added, negative = deducted
  note        VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- SEED: Default Admin User
-- password: admin123 (bcrypt hashed)
-- ─────────────────────────────────────────
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@erp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- ─────────────────────────────────────────
-- SEED: Initial Products (from frontend)
-- ─────────────────────────────────────────
INSERT INTO products (name, price, stock) VALUES
('Laptop Pro 15"',       1200.00, 10),
('Wireless Mouse',         25.00, 50),
('Mechanical Keyboard',    80.00, 15),
('USB-C Hub',              40.00,  5),
('HD Monitor 27"',        300.00,  8)
ON DUPLICATE KEY UPDATE id=id;
