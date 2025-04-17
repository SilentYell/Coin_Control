const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust path as needed

// Get all savings goals for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM SavingsGoals WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new savings goal
router.post('/', async (req, res) => {
  const { user_id, percent } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO SavingsGoals (user_id, percent) VALUES ($1, $2) RETURNING *',
      [user_id, percent]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a savings goal
router.put('/:goal_id', async (req, res) => {
  const { goal_id } = req.params;
  const { percent } = req.body;
  try {
    const result = await db.query(
      'UPDATE SavingsGoals SET percent = $1 WHERE goal_id = $2 RETURNING *',
      [percent, goal_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a savings goal
router.delete('/:goal_id', async (req, res) => {
  const { goal_id } = req.params;
  try {
    await db.query('DELETE FROM SavingsGoals WHERE goal_id = $1', [goal_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;