
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

/**
 * Functions takes in an array of dates and check if there are 7 days in a row
 * @param {Array} dates - the array of dates
 * @returns {Boolean} true if there are 7 conescutive days, false otherwise
 */
const sevenConsecutiveDaysCalc = (dates) => {
  // Remove duplicates, sort ascending
  const uniqueSorted = [...new Set(dates.map(date => date.toISOString().slice(0,10)))]
    .map(date => new Date(date))
    .sort((a,b) => a - b);

    console.log('dates sorted and cleaned: ', uniqueSorted);

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueSorted.length; i++) {
    const prev = uniqueSorted[i - 1];
    const curr = uniqueSorted[i];

    const diffInDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));


    if (diffInDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diffInDays > 1) {
      currentStreak = 1;
    }
  }

  return maxStreak >= 7;
};

/**
 * Takes a database config and userId and queries the database for dates from income and expense tables for the user.
 * @param {Files} db - database to query
 * @param {Number} userId - - ID of the user to check data for
 * @returns {Boolean} true if the sevenConsecutiveDaysCalc function is true, false otherwise
 */
export const transactionDatesCheck = async (db, userId) => {
  const transactionDatesQuery = `
  SELECT
    DATE(last_payment_date) AS txn_date,
    'Income' AS type
  FROM income
  WHERE user_id = $1

  UNION

  SELECT
  DATE(expense_date) AS txn_date,
  'Expense' AS type
  FROM expenses
  WHERE user_id = $1
  `;

  const { rows } = await db.query(transactionDatesQuery, [userId]);
  const dates = rows.map(row => new Date(row.txn_date));
  return sevenConsecutiveDaysCalc(dates);
};