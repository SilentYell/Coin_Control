const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { escapeLiteral } = require('pg');

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

// GET /api/expenses - get all expenses for user
router.get('/expenses/:id', (req, res) => {
  const { id } = req.params;

  const query = `
  SELECT
    *
  FROM expenses
  WHERE expense_id = $1;
  `
  db.query(query, [id])
  .then(({ rows }) => {
    res.json(rows);
  })
  .catch((err) => {
    console.error(`Error fetching expense ID ${id}`, err);
  })
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

// PUT /api/expenses/:id - update existing expense
router.put('/expenses/:id', async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { name, amount, expense_date, category } = req.body;
    const userId = 1; // hardcoded userID 1 for now and we can update this later

    // validate fields that are required
    if (!amount || !expense_date) {
      return res
        .status(400)
        .json({ error: 'Amount and date are required to proceed' });
    }

    // update the expense in the database
    const result = await db.query(
      'UPDATE Expenses SET name = $1, amount = $2, expense_date = $3, category = $4 WHERE expense_id = $5 AND user_id = $6 RETURNING *',
      [name, amount, expense_date, category, expenseId, userId]
    );

    // if no rows were affected, the expense might not exist or doesn't belong to this user
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'Expense not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating expense!', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE /api/expenses/:id - delete an expense
router.delete('/expenses/:id', async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = 1; // hardcoded userID 1 for now

    // delete the expense from the database
    const result = await db.query(
      'DELETE FROM Expenses WHERE expense_id = $1 AND user_id = $2 RETURNING *',
      [expenseId, userId]
    );

    // if no rows were affected, the expense might not exist or doesn't belong to this user
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    res.json({
      message: 'Expense deleted successfully',
      deletedExpense: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting expense!', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;