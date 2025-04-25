// Handles trophies-related API routes
const router = require("express").Router();
const { checkAndAwardTrophies } = require("../services/trophies");

module.exports = db => {
  // Get all trophies for the user
  router.get("/trophies/:userId", async (req, res) => {
    const userId = 1; // change this later to be dynamic

    // Check user trophies after successful income post
    let earnedTrophies = [];
    try {
      earnedTrophies = await checkAndAwardTrophies(userId);
    } catch (error) {
      console.error(`Error checking trophies`, error);
    }

    const query = `
    SELECT
      *
    FROM user_trophies
    JOIN trophies ON user_trophies.trophy_id = trophies.trophy_id
    WHERE user_id = $1
    ORDER BY earned_at;
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