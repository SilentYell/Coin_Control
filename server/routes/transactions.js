// Handles income-related API routes
const router = require("express").Router();

module.exports = db => {
  // Get all income entries for the user
  router.get("/transactions", (req, res) => {
    const userId = 1; // change this later to be dynamic
    const queryParams = [userId];

    const query = `
    SELECT
        income_id AS id,
        amount,
        last_payment_date AS date,
        'Income' AS type
    FROM income
    JOIN users ON income.user_id = users.user_id
    where users.user_id = $1

    UNION

    SELECT
      expense_id AS id,
      amount,
      expense_date AS date,
      'Expense' AS type
    FROM expenses
    JOIN users ON expenses.user_id = users.user_id
    WHERE users.user_id = $1

    ORDER BY date;
    `;

    db.query(query, queryParams)
    .then(({ rows }) => {
      res.json(rows);
    });
  });

  /*
  // Add a new income entry, allocate savings if applicable
  router.post("/income", async (req, res) => {
    const { amount, last_payment_date, frequency } = req.body;
    const user_id = 1; // should come from req.body, will change to handle dynamic user ID later

    // Validate required fields
    if (!amount || !last_payment_date || !frequency) {
      return res.status(400).json({ error: "Amount, last payment date, and frequency are required." });
    }

    try {
      // Insert the new income
      const insertResult = await db.query(
        `INSERT INTO income (user_id, amount, last_payment_date, frequency)
         VALUES ($1, $2, $3, $4)
         RETURNING *;`,
        [user_id, amount, last_payment_date, frequency]
      );
      const newIncome = insertResult.rows[0];

      // Fetch the latest savings goal for the user
      const goalResult = await db.query(
        `SELECT * FROM SavingsGoals WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [user_id]
      );
      const goal = goalResult.rows[0];

      let allocated = 0;
      if (goal) {
        // Compare only the date part (YYYY-MM-DD) for same day or after
        const goalDate = new Date(goal.created_at).toISOString().split('T')[0];
        const incomeDate = new Date(last_payment_date).toISOString().split('T')[0];
        if (incomeDate >= goalDate) {
          allocated = amount * (goal.percent / 100);
          await db.query(
            `UPDATE SavingsGoals SET saved = saved + $1 WHERE goal_id = $2`,
            [allocated, goal.goal_id]
          );
        }
      }

      // (Optional) Deduct allocated from user's current_balance
      await db.query(`UPDATE Users SET current_balance = current_balance - $1 WHERE user_id = $2`, [allocated, user_id]);

      res.status(201).json(newIncome);
    } catch (err) {
      console.error('Error inserting income and allocating to savings goal', err);
      res.status(500).json({error: 'Internal Server Error'});
    }
  });

  // Delete an income record by ID
  router.delete("/delete/income/:id", (req, res) => {
    const { id } = req.params;

    const query = `
    DELETE FROM income
    WHERE income_id = $1
    RETURNING *;
    `;

    db.query(query, [id])
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: `Income record with ID ${id} not found.` });
      }
      res.status(200).json({ message: "Income record deleted successfully." });
    })
    .catch((err) => {
      console.error('Error deleting income record:', err);
      res.status(500).json({error: 'Internal Server Error'});
    });
  });

  // Update an income record by ID
  router.put("/income/:id", (req, res) => {
    const { id } = req.params;
    const { amount, last_payment_date, frequency } = req.body;

    // Validate required fields
    if (!amount || !last_payment_date || !frequency) {
      return res.status(400).json({ error: "Amount, last payment date, and frequency are required." });
    }

    const queryParams = [Number(id), amount, last_payment_date, frequency];
    const query = `
    UPDATE income
    SET
      amount = $2,
      last_payment_date = $3,
      frequency = $4
    WHERE income_id = $1
    RETURNING *;
    `;

    db.query(query, queryParams)
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: `Income record with ID ${id} not found.` });
      }
      res.status(201).json(result.rows[0]);
    })
    .catch((err) => {
      console.error('Error updating income record: ', err);
      res.status(500).json({ error: "Internal Server Error" });
    });
  });
  */

  return router;
};