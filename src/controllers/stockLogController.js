import pool from '../config/db.js';

// GET /api/stock-logs
export const getStockLogs = async (req, res) => {
  try {
    const { product_id, type } = req.query;
    let query = `
      SELECT sl.id, sl.change_type, sl.quantity, sl.note, sl.created_at,
             p.name AS product_name, p.id AS product_id
      FROM stock_logs sl
      JOIN products p ON sl.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (product_id) {
      query += ' AND sl.product_id = ?';
      params.push(product_id);
    }
    if (type) {
      query += ' AND sl.change_type = ?';
      params.push(type);
    }

    query += ' ORDER BY sl.created_at DESC LIMIT 200';

    const [logs] = await pool.query(query, params);
    return res.json({ success: true, data: logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
