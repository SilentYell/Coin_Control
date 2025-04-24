const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Helper for consistent error responses
function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

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
    sendError(res, 500, 'Failed to fetch savings goals');
  }
});

// Add a new savings goal (only one per user, override old)
router.post('/', async (req, res) => {
  const { user_id, name, amount, percent } = req.body;
  try {
    // Delete any existing goal for this user
    await db.query('DELETE FROM SavingsGoals WHERE user_id = $1', [user_id]);
    // Insert the new goal
    const result = await db.query(
      'INSERT INTO SavingsGoals (user_id, name, amount, percent) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, name, amount, percent]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    sendError(res, 500, 'Failed to add savings goal');
  }
});

// Update a savings goal
router.put('/:goal_id', async (req, res) => {
  const { goal_id } = req.params;
  const { name, amount, percent, saved } = req.body;
  try {
    // Update the savings goal
    const result = await db.query(
      'UPDATE SavingsGoals SET name = $1, amount = $2, percent = $3, saved = $4 WHERE goal_id = $5 RETURNING *',
      [name, amount, percent, saved, goal_id]
    );

    if (result.rows.length === 0) {
      return sendError(res, 404, 'Savings goal not found.');
    }

    const updatedGoal = result.rows[0];

    res.json(updatedGoal);
  } catch (err) {
    sendError(res, 500, 'Failed to update savings goal');
  }
});

// Delete a savings goal
router.delete('/:goal_id', async (req, res) => {
  const { goal_id } = req.params;
  try {
    await db.query('DELETE FROM SavingsGoals WHERE goal_id = $1', [goal_id]);
    res.json({ success: true });
  } catch (err) {
    sendError(res, 500, 'Failed to delete savings goal');
  }
});

module.exports = router;