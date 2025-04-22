const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET route for trophies specific to a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await db.query(
      `SELECT t.*
      FROM user_trophies ut
      JOIN trophies t ON ut.trophy_id = t.trophy_id
      WHERE ut.user_id = $1`,
      [user_id]
    );

    res.json(result.rows); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;