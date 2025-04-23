// Handles trophies-related API routes
const router = require("express").Router();

module.exports = db => {
  // Get all trophies for the user
  router.get("/trophies", (req, res) => {
    const userId = 1; // change this later to be dynamic

    const query = `
    SELECT
      *
    FROM user_trophies
    JOIN trophies ON user_trophies.trophy_id = trophies.trophy_id
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