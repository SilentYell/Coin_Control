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

const trophyChecks = {
  first_transaction: async (db, userId) => {
    const tablesToCheck = {
      expenses: 'expenses',
      income: 'income'
    };
    return await featureUsageCheck(db, userId, tablesToCheck);
  },
  first_savings: async (db, userId)  => {
    const savingsCount = await db.query(`SELECT COUNT(*) FROM savingsgoals WHERE user_id = $1;`, [userId]);
    if (!savingsCount) return false;
    return Number(savingsCount.rows[0].count) >=1;
  },
  equal_to_goal: async (db, userId)  => {
    const result = await savingsMilestonesCheck(db, userId);
    if (!result) return false;
    return Number(result?.saved) === Number(result.amount);
  },
  save_income_10: async (db, userId)  => {
    const savings =  await savingsMilestonesCheck(db, userId);
    if (!savings) return false;
    return Number(savings?.saved) >= 10;
  },
  save_income_50: async (db, userId)  => {
    const savings =  await savingsMilestonesCheck(db, userId);
    if (!savings) return false;
    return Number(savings?.saved)  >= 50;
  },
  save_income_100: async (db, userId)  => {
    const savings =  await savingsMilestonesCheck(db, userId);
    if (!savings) return false;
    return Number(savings?.saved)  >= 100;
  },
  save_income_1000: async (db, userId)  => {
    const savings =  await savingsMilestonesCheck(db, userId);
    if (!savings) return false;
    return Number(savings?.saved)  > 1000;
  },
  spend_10: async (db, userId)  => {
    const spendings =  await spendingMilestonesCheck(db, userId);
    if (!spendings) return false;
    return Number(spendings?.total) >= 10;
  },
  spend_50: async (db, userId)  => {
    const spendings =  await spendingMilestonesCheck(db, userId);
    if (!spendings) return false;
    return Number(spendings?.total) >= 50;
  },
  spend_100: async (db, userId)  => {
    const spendings =  await spendingMilestonesCheck(db, userId);
    if (!spendings) return false;
    return Number(spendings?.total) >= 100;
  },
  spend_1000: async (db, userId)  => {
    const spendings =  await spendingMilestonesCheck(db, userId);
    if (!spendings) return false;
    return Number(spendings?.total) > 1000;
  },
    //transaction_for_7_days: async (db, userId)  => {
  //  const result = await db.query(``, []);
  //  return ;
  //},
  use_all_features: async (db, userId)  => {
    const tablesToCheck = {
      expenses: 'expenses',
      income: 'income',
      "savings goals": 'savingsgoals'
    };

    return await featureUsageCheck(db, userId, tablesToCheck);
  }
};

module.exports = { trophyChecks }