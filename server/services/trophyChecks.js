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
  save_income_1000:  async (db, userId, context)  => {
    console.log('inside check fn, context: ', context)
    const result = await db.query(`SELECT * FROM savingsgoals WHERE user_id = $1`, [userId]);
    return context.saved >= 1000;
  },
};

module.exports = { trophyChecks }