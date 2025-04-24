const db = require('../db/database.js');
const { trophyChecks } = require('./trophyChecks.js')

/**
 * Check if a userId has earned any trophies, returns earned trophies
 * @param {Number} userId - the provided user to check if earned
 *
 * @returns {Array} trophiesToAward - an array containing the trophies the use has earned
 */
async function checkAndAwardTrophies(userId) {
  const earned = await db.query(`
      SELECT
        t.criteria_key
      FROM user_trophies ut
      JOIN trophies t ON t.trophy_id = ut.trophy_id
      WHERE ut.user_id = $1;
    `, [userId])


  console.log('earned trophies query: ', earned)


  const earnedKeys = earned.rows.map(r => r.criteria_key);

  console.log('Already earned keys: ', earnedKeys)
  const trophiesToAward = [];

  // Loop through defined checks in trophyChecks.js
  for (const [key, checkFn] of Object.entries(trophyChecks)) {
    if (!earnedKeys.includes(key)) {
      const passed = await checkFn(db, userId);
      if (passed) {
        const trophy = await db.query(`SELECT trophy_id FROM trophies WHERE criteria_key = $1`, [key]);

        console.log('trophy', trophy)

        if (trophy.rows.length > 0) {
          await db.query(`
            INSERT INTO user_trophies (user_id, trophy_id)
            VALUES ($1, $2)
            `, [userId, trophy.rows[0].trophy_id]);
          trophiesToAward.push(key);
        } else {
          console.warn(`No trophy found for criteria key: ${key}`)
        }
      }
    }
  }

  return trophiesToAward;
};

module.exports = { checkAndAwardTrophies }