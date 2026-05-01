import pool from '../config/db.js';

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT id, name, price, stock,
        CASE
          WHEN stock > low_stock_threshold THEN 'Healthy'
          WHEN stock > 0 THEN 'Low Stock'
          ELSE 'Out of Stock'
        END AS status
      FROM products
      ORDER BY id ASC`
    );
    return res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, price, stock,
        CASE
          WHEN stock > low_stock_threshold THEN 'Healthy'
          WHEN stock > 0 THEN 'Low Stock'
          ELSE 'Out of Stock'
        END AS status
      FROM products WHERE id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, low_stock_threshold } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'name and price are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, price, stock, low_stock_threshold) VALUES (?, ?, ?, ?)',
      [name, price, stock || 0, low_stock_threshold || 10]
    );

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: result.insertId, name, price, stock: stock || 0 },
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { name, price, low_stock_threshold } = req.body;
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await pool.query(
      'UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), low_stock_threshold = COALESCE(?, low_stock_threshold) WHERE id = ?',
      [name, price, low_stock_threshold, id]
    );

    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Product updated', data: updated[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/products/:id/restock
export const restockProduct = async (req, res) => {
  try {
    const { amount } = req.body;
    const { id } = req.params;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'amount must be a positive number' });
    }

    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [amount, id]);

    // Log stock change
    await pool.query(
      'INSERT INTO stock_logs (product_id, change_type, quantity, note) VALUES (?, ?, ?, ?)',
      [id, 'restock', amount, `Restocked by ${amount} units`]
    );

    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: `Restocked successfully. New stock: ${updated[0].stock}`,
      data: updated[0],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
