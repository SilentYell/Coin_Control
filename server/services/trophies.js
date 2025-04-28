const db = require('../db/database.js');
const { trophyChecks } = require('./trophyChecks.js')

/**
 * Check if a userId has earned any trophies, returns earned trophies
 * @param {Number} userId - the provided user to check if earned
 *
 * @returns {Array} trophiesToAward - an array containing the trophies the use has earned
 */
async function checkAndAwardBadgeTrophies(userId) {
  const earned = await db.query(`
      SELECT
        bt.criteria_key
      FROM user_trophies ut
      JOIN badge_trophies bt ON ut.badge_id = bt.trophy_id
      WHERE ut.user_id = $1
      AND ut.type = $2;
    `, [userId, 'badge'])


  const earnedKeys = earned.rows.map(r => r.criteria_key);
  // Loop through defined checks in trophyChecks.js
  for (const [key, checkFn] of Object.entries(trophyChecks)) {
    if (!earnedKeys.includes(key)) {
      const passed = await checkFn(db, userId);
      if (passed) {

        const trophy = await db.query(`SELECT trophy_id FROM badge_trophies WHERE criteria_key = $1`, [key]);

        if (trophy.rows.length > 0) {
          const awardedDate = new Date().toISOString().split('T')[0];
          const badgeId = trophy.rows[0].trophy_id;
          const trophyId = null; // null trophy_id for trophy.type 'badge'

          // Double-check: has this badge already been awarded?
          const alreadyAwarded = await db.query(
            `SELECT 1 FROM user_trophies WHERE user_id = $1 AND badge_id = $2`,
            [userId, badgeId]
          );


          if (alreadyAwarded.rows.length === 0) {
            try {
            await db.query(`
              INSERT INTO user_trophies (user_id, trophy_id, badge_id, awarded_at, type)
              VALUES ($1, $2, $3, $4, $5)
              ON CONFLICT DO NOTHING;
            `, [userId, trophyId, badgeId, awardedDate, 'badge']);
            } catch ( err ) {
              if (err === '23505') {
                console.warn(`Duplicate insert prevented for user ${userId}, badge ${badgeId}`);
              } else {
                throw err;
              }
            }
          } else {
            console.warn(`User ${userId} already has badge ${key}`)
          }
        } else {
          console.warn(`No trophy found for criteria key: ${key}`)
        }
      }
    }
  }
};

module.exports = { checkAndAwardBadgeTrophies }