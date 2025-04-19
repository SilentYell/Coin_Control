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


  // Delete a transactions record by ID, use type of transactions for query
  router.delete("/delete/transactions/:type/:id", (req, res) => {
    const { id, type } = req.params;

    let query = '';

    // Check for transaction type
    if (type === 'Income') {
      // if Income type, delete from income table
      query = `
        DELETE FROM income
        WHERE income_id = $1
        RETURNING *;
      `;
    } else {
      // if Expense type, delete from expense table
      query = `
        DELETE FROM expenses
        WHERE expense_id = $1
        RETURNING *;
      `;
    }

    db.query(query, [id])
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: `Transaction record with ID ${id} and type ${type} not found.` });
      }
      res.status(200).json({ message: "Transaction record deleted successfully." });
    })
    .catch((err) => {
      console.error('Error deleting transaction record:', err);
      res.status(500).json({error: 'Internal Server Error'});
    });
  });

  // Update a transaction record by ID, use type of transaction for query
  router.put("/transactions/:type/:id", (req, res) => {
    const { id } = req.params;
    const { amount, date, type } = req.body;

    // Validate required fields
    if (!amount || !date) {
      return res.status(400).json({ error: "Amount or date is required." });
    }

    const queryParams = [Number(id), amount, date];

    let query = '';

    // Check transaction type, build appropriate query
    if (type === 'Income') {
      query = `
        UPDATE income
        SET
          amount = $2,
          last_payment_date = $3
        WHERE income_id = $1
        RETURNING *;
      `;
    } else {
      query = `
        UPDATE expenses
        SET
          amount = $2,
          expense_date = $3
        WHERE expense_id = $1
        RETURNING *;
      `;
    }


    db.query(query, queryParams)
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: `Transaction record with ID ${id} and type ${type} not found.` });
      }
      res.status(201).json(result.rows[0]);
    })
    .catch((err) => {
      console.error('Error updating transaction record: ', err);
      res.status(500).json({ error: "Internal Server Error" });
    });
  });

  return router;
};