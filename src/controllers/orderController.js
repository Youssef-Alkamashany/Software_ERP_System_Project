import pool from '../config/db.js';

// GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.id, o.total, o.status, o.created_at,
              u.name AS cashier_name
       FROM orders o
       LEFT JOIN users u ON o.cashier_id = u.id
       ORDER BY o.created_at DESC`
    );
    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.id, o.total, o.status, o.created_at,
              u.name AS cashier_name
       FROM orders o
       LEFT JOIN users u ON o.cashier_id = u.id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const [items] = await pool.query(
      `SELECT oi.id, oi.quantity, oi.unit_price, oi.subtotal,
              p.name AS product_name, p.id AS product_id
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    return res.json({
      success: true,
      data: { ...orders[0], items },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/orders  — THE CORE INTEGRATION: Sales → Inventory
export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const { cart } = req.body; // cart: [{ product_id, quantity }]
    const cashier_id = req.user?.id || null;

    if (!cart || cart.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // ── Step 1: Validate stock for every item ──
    for (const item of cart) {
      const [rows] = await connection.query(
        'SELECT id, name, stock FROM products WHERE id = ? FOR UPDATE',
        [item.product_id]
      );
      if (rows.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({
          success: false,
          message: `Product ID ${item.product_id} not found`,
        });
      }
      if (rows[0].stock < item.quantity) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${rows[0].name}". Available: ${rows[0].stock}`,
        });
      }
    }

    // ── Step 2: Calculate total ──
    let total = 0;
    const enrichedCart = [];
    for (const item of cart) {
      const [rows] = await connection.query(
        'SELECT id, name, price FROM products WHERE id = ?',
        [item.product_id]
      );
      const product = rows[0];
      const subtotal = product.price * item.quantity;
      total += subtotal;
      enrichedCart.push({ ...item, unit_price: product.price, subtotal });
    }

    // ── Step 3: Create order record ──
    const [orderResult] = await connection.query(
      'INSERT INTO orders (total, status, cashier_id) VALUES (?, ?, ?)',
      [total, 'completed', cashier_id]
    );
    const orderId = orderResult.insertId;

    // ── Step 4: Insert order items + deduct stock + log ──
    for (const item of enrichedCart) {
      // Insert order item
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.unit_price]
      );

      // Deduct from inventory (THE INTEGRATION LOGIC)
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );

      // Audit log
      await connection.query(
        'INSERT INTO stock_logs (product_id, change_type, quantity, note) VALUES (?, ?, ?, ?)',
        [item.product_id, 'sale', -item.quantity, `Sold via Order #${orderId}`]
      );
    }

    await connection.commit();
    connection.release();

    return res.status(201).json({
      success: true,
      message: 'Order processed successfully! Inventory has been updated automatically.',
      data: { order_id: orderId, total, items_count: cart.length },
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [req.params.id]
    );
    if (orders.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (orders[0].status === 'cancelled') {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ success: false, message: 'Order already cancelled' });
    }

    // Restore stock
    const [items] = await connection.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
      [req.params.id]
    );
    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
      await connection.query(
        'INSERT INTO stock_logs (product_id, change_type, quantity, note) VALUES (?, ?, ?, ?)',
        [item.product_id, 'adjustment', item.quantity, `Stock restored — Order #${req.params.id} cancelled`]
      );
    }

    await connection.query(
      "UPDATE orders SET status = 'cancelled' WHERE id = ?",
      [req.params.id]
    );

    await connection.commit();
    connection.release();

    return res.json({ success: true, message: 'Order cancelled and stock restored' });
  } catch (error) {
    await connection.rollback();
    connection.release();
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
