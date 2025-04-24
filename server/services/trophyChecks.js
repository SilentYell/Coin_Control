const { featureUsageCheck, savingsMilestonesCheck, spendingMilestonesCheck } = require('./trophyCheckHelpers')


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