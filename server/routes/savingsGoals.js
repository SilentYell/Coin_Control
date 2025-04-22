const express = require('express');
const router = express.Router();
const db = require('../db/database');

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
    console.log('Savings goal added:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a savings goal & check/add trophy if milestone met
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
      return res.status(404).json({ error: 'Savings goal not found.' });
    }

    const updatedGoal = result.rows[0];

    // Check percent of goal saved
    const savedPercent = (updatedGoal.saved / updatedGoal.amount) * 100;

    // Check for trophy milestones
    const trophiesResult = await db.query(
      `SELECT * FROM trophies WHERE percent_required <= $1`,
      [savedPercent]
    );
  
    // Create array for trophies achieved
    const newTrophies = [];

    // Check if trophy has already been awarded 
    for (const trophy of trophiesResult.rows) {
      const existingTrophy = await db.query(
        `SELECT * FROM user_trophies WHERE user_id = $1 AND trophy_id = $2`,
        [updatedGoal.user_id, trophy.trophy_id]
      );
      
      // If trophy has not been achieved, insert into user_trophies table
      if (existingTrophy.rows.length === 0) {
        await db.query(
          `INSERT INTO user_trophies (user_id, trophy_id) VALUES ($1, $2)`,
          [updatedGoal.user_id, trophy.trophy_id]
        );
        newTrophies.push(trophy);
      }
    }

    res.json({ updatedGoal, newTrophies });
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