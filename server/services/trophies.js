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

  console.log("earned trophies: ", earned.rows);

  const earnedKeys = earned.rows.map(r => r.criteria_key);

  console.log("earned trophies KEYS: ", earnedKeys);
  const trophiesToAward = [];

  // Loop through defined checks in trophyChecks.js
  for (const [key, checkFn] of Object.entries(trophyChecks)) {
    if (!earnedKeys.includes(key)) {
      const passed = await checkFn(db, userId);
      console.log('checkFn used?', checkFn)
      console.log('checkFn passed?', passed)

      if (passed) {
        console.log('inside passed if: ', key)
        const trophy = await db.query(`SELECT trophy_id FROM trophies WHERE criteria_key = $1`, [key]);
        console.log(`Query all trophies with key: ${key}`, trophy)
        if (trophy.rows.length) {
          await db.query(`INSERT INTO user_trophies (user_id, trophy_id) VALUES ($1, $2)`, [userId, trophy.rows[0].trophy_id]);
          trophiesToAward.push(key);
        }
      }
    }
  }

  console.log('trophiesToAward', trophiesToAward);

  return trophiesToAward;
};

module.exports = { checkAndAwardTrophies }