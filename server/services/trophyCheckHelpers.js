
/**
 * Takes in a database config and userId. Queries the savingsGoal table to return all rows.
 * @param {Files} db - database to query
 * @param {Number} userId - ID of the user to check savings for
 * @returns {Object} savings - the resulting query
 */
export const savingsMilestonesCheck = async (db, userId) => {
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
export const spendingMilestonesCheck = async (db, userId) => {
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
export const featureUsageCheck = async (db, userId, tablesToCheck) => {
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

