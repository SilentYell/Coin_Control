// Handles badges-related API routes
const router = require("express").Router();

module.exports = db => {
  // Get all badges for the user
  router.get("/badges", (req, res) => {
    const userId = 1; // change this later to be dynamic

    const query = `
    SELECT
      *
    FROM user_badges
    JOIN badges ON user_badges.badge_id = badges.badge_id
    WHERE user_id = $1
    ORDER BY earned_at;
    `;

    db.query(query, [userId])
    .then(({ rows }) => {
      res.json(rows);
    });
  });

  return router;
};