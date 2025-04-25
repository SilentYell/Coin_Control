const db = require('../db/database');

const checkAndAwardTrophies = async (user_id, goal) => {
  try {

    // Calculate saved percentage and round to whole number
    const savedPercent = Math.floor((goal.saved / goal.amount) * 100);

    // Compare percent saved to percent required in db
    const trophiesResult = await db.query(
      `SELECT * FROM trophies WHERE percent_required <= $1`, 
      [savedPercent]
    );
  
    const newTrophies = [];
  
    // Check for existing trophies and then push new to array
    for (const trophy of trophiesResult.rows) {
      const existingTrophy = await db.query(
        `SELECT * FROM user_trophies WHERE user_id = $1 AND trophy_id = $2`,
        [user_id, trophy.trophy_id]
      );
  
      if (existingTrophy.rows.length === 0) {
        await db.query(
          `INSERT INTO user_trophies (user_id, trophy_id) VALUES ($1, $2)`,
          [goal.user_id, trophy.trophy_id]
        );
        newTrophies.push(trophy);
      }
    }

    return newTrophies;
  } catch (err) {
    console.error("Error checking and awarding trophies: ", err);
    throw new Error('Error awarding trophies');
  }
};

module.exports = { checkAndAwardTrophies };