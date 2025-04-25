// Handles trophies-related API routes
const router = require("express").Router();
const { checkAndAwardBadgeTrophies } = require("../services/trophies");

module.exports = db => {
  // Get all trophies for the user
  router.get("/trophies/:userId", async (req, res) => {
    const userId = 1; // change this later to be dynamic

    // Check user trophies after successful income post
    let earnedTrophies = [];
    try {
      earnedTrophies = await checkAndAwardBadgeTrophies(userId);
    } catch (error) {
      console.error(`Error checking trophies`, error);
    }

    const query = `
    SELECT
      *
    FROM user_trophies
    JOIN badge_trophies ON user_trophies.badge_id = badge_trophies.trophy_id
    WHERE user_id = $1
    ORDER BY awarded_at;
    `;

    try {
      const { rows } = await db.query(query, [userId]);
      res.json({
        allTrophies: rows,
        earnedTrophies
      })
    } catch (error) {
      console.error(`Error fetching trophies: `, error);
      res.status(500).json({ error: "Error fetching trophies"});
    }
  });

  return router;
};