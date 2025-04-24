const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Helper for consistent error responses
function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Trophies ORDER BY percent_required ASC');
    res.json(result.rows);
  } catch (err) {
    sendError(res, 500, 'Failed to fetch trophies');
  }
});

module.exports = router;