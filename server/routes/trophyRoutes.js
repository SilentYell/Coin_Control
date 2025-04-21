const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Trophies ORDER BY percent_required ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching trophies:', err);
    res.status(500).json({ error: 'Failed to fetch trophies' });
  }
});

module.exports = router;