const savingsMilestones = [
  {key: 'save_income_10', amount: 10},
  {key: 'save_income_50', amount: 50},
  {key: 'save_income_100', amount: 100},
  {key: 'save_income_1000', amount: 1000},
];

const savingsMilestonesCheck = async (db, userId) => {
  const savingsQuery = `SELECT * FROM savingsgoals WHERE user_id = $1`;
  const result = await db.query(savingsQuery, [userId]);
  return result.rows[0]?.saved;
};


const trophyChecks = {
  first_transaction: async (db, userId) => {
    const result = await db.query(`SELECT COUNT(*) FROM income WHERE user_id = $1;`, [userId]);
    return Number(result.rows[0].count) >= 1;
  },
  first_savings: async (db, userId)  => {
    const result = await db.query(`SELECT COUNT(*) FROM savingsgoals WHERE user_id = $1;`, [userId]);
    return Number(result.rows[0].count) >=1;
  },
  //transaction_for_7_days: async (db, userId)  => {
  //  const result = await db.query(``, []);
  //  return ;
  //},
  //equal_to_goal: async (db, userId)  => {
  //  const result = await db.query(``, []);
  //  return ;
  //},
  //use_all_features: async (db, userId)  => {
  //  const result = await db.query(``, []);
  //  return ;
  //},
  save_income_10: async (db, userId)  => {
    const saved =  await savingsMilestonesCheck(db, userId);
    return saved >= 10;
  },
  save_income_50: async (db, userId)  => {
    const saved =  await savingsMilestonesCheck(db, userId);
    return saved >= 50;
  },
  save_income_100: async (db, userId)  => {
    const saved =  await savingsMilestonesCheck(db, userId);
    return saved >= 100;
  },
  save_income_1000: async (db, userId)  => {
    const saved =  await savingsMilestonesCheck(db, userId);
    return saved > 1000;
  },
};

module.exports = { trophyChecks }