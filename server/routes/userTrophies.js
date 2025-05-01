const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { checkAndAwardBadgeTrophies } = require("../services/trophies");


// Helper for consistent error responses
function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

// GET route for trophies specific to a user
router.get('/:user_id', async (req, res) => {
  const userId = Number(req.params.user_id);

    // Check user trophies and insert into DB after successful income post
    try {
      await checkAndAwardBadgeTrophies(userId); // inserts new trophies into DB
    } catch (error) {
      console.error(`Error checking trophies`, error);
    }

  try {
    const result = await db.query(`
      SELECT
      ROW_NUMBER() OVER () AS id, -- unique ID per row
        *
      FROM (
      SELECT
        t.name,
        t.description,
        t.percent_required::text AS criteria,
        t.icon_url AS icon_path,
        ut.type,
        ut.awarded_at
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
        ut.awarded_at
      FROM user_trophies ut
      JOIN badge_trophies bt ON ut.badge_id = bt.trophy_id
      WHERE ut.user_id = $1
      ) AS combined;
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    sendError(res, 500, 'Failed to fetch user trophies');
  }
});

module.exports = router;