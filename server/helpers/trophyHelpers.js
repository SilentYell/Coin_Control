const db = require('../db/database');

const checkAndAwardTrophies = async (user_id, goal) => {
  try {
    console.log(`Goal saved: ${goal.saved}, Goal amount: ${goal.amount}`);
    const savedPercent = Math.floor((goal.saved / goal.amount) * 100);
    console.log(`Calculated savedPercent: ${savedPercent}`);

    const trophiesResult = await db.query(
      `SELECT * FROM trophies WHERE percent_required <= $1`, 
      [savedPercent]
    );
    console.log(`Eligible trophies at ${savedPercent}%:`, trophiesResult.rows);
  
    const newTrophies = [];
  
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