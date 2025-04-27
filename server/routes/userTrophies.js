const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Helper for consistent error responses
function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

// GET route for trophies specific to a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await db.query(
      `SELECT
        t.name,
        t.description,
        t.percent_required::text AS criteria,
        t.icon_url AS icon_path,
        ut.type,
        ut.trophy_id AS id
      FROM user_trophies ut
      JOIN trophies t ON ut.trophy_id = t.trophy_id
      WHERE ut.user_id = $1


      UNION

      SELECT
        bt.name,
        bt.description,
        bt.criteria_key AS criteria,
        bt.icon_path AS icon_path,
        ut.type,
        ut.badge_id AS id
      FROM user_trophies ut
      JOIN badge_trophies bt ON ut.badge_id = bt.trophy_id
      WHERE ut.user_id = $1
      ;`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    sendError(res, 500, 'Failed to fetch user trophies');
  }
});

module.exports = router;