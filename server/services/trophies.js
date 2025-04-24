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

/**
 * Takes in a database config and userId. Queries the savingsGoal table to return all rows.
 * @param {Files} db - database to query
 * @param {Number} userId - ID of the user to check savings for
 * @returns {Object} savings - the resulting query
 */
const savingsMilestonesCheck = async (db, userId) => {
  const savingsQuery = `SELECT * FROM savingsgoals WHERE user_id = $1`;
  const savings = await db.query(savingsQuery, [userId]);

  // No savings goal set yet, skip this trophy
  if (savings.rows.length === 0) {
    console.log(`Skipping savings milestone — no goal set for user ${userId}`);
    return null;
  }

  return savings.rows[0];
};

/**
 * Takes in a database config and userId. Queries the expenses table to return the total sum.
 * @param {Files} db - database to query
 * @param {Number} userId - ID of the user to check savings for
 * @returns {Object} spendings - the resulting query
 */
const spendingMilestonesCheck = async (db, userId) => {
  const expenseQuery = `SELECT SUM(ABS(amount)) as total FROM expenses WHERE user_id = $1;`;
  const spendings = await db.query(expenseQuery, [userId]);
  return spendings.rows[0];
};

/**
 * Queries database for existing records for a given userId and given set of tables
 * @param {Files} db - database to query
 * @param {Number} userId - - ID of the user to check data for
 * @param {Object} tablesToCheck - contains the name of the tables to perform queries on
 * @returns
 */
const featureUsageCheck = async (db, userId, tablesToCheck) => {
  for (const [featureName, table] of Object.entries(tablesToCheck)) {
    const result = await db.query(`
      SELECT
        1 AS exists
      FROM ${table}
      WHERE user_id = $1
      LIMIT 1;
      `, [userId]);

    if (result.rows.length === 0) {
      console.log(`User ${userId} has not used feature: ${featureName}`);
      return false;
    }
  }

  console.log(`User ${userId} has used all features!`)
  return true;
;}

module.exports = { checkAndAwardTrophies }