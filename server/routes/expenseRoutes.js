const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/expenses - get all expenses for user
router.get('/expenses', async (req, res) => {
  try {
    const userId = 1; // we can replace this with authenticated user in the future
    const result = await db.query(
      'SELECT * FROM Expenses WHERE user_id = $1 ORDER BY expense_date DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching expenses', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

module.exports = router;
