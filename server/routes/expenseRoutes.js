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

// POST /api/expenses - create a new expense
router.post('/expenses', async (req, res) => {
  try {
    const { name, amount, expense_date, category } = req.body;
    const userId = 1; // hardcoded userID 1 for now and we can update this later

    // validate fields that are required
    if (!amount || !expense_date) {
      return res
        .status(400)
        .json({ error: 'Amount and date are required to proceed' });
    }

    // insert the new expense into the database
    const result = await db.query(
      'INSERT INTO Expenses (user_id, amount, expense_date, category, name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, amount, expense_date, category, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating expense!', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

module.exports = router;
