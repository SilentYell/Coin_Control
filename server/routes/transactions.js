// Handles income-related API routes
const router = require("express").Router();

// Helper for consistent error responses
function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

module.exports = db => {
  // Get all income entries for the user
  router.get("/transactions", (req, res) => {
    const userId = 1; // change this later to be dynamic
    const queryParams = [userId];

    const query = `
    SELECT
        'income-' || income_id AS uid,
        income_id AS id,
        amount,
        last_payment_date AS date,
        'Income' AS type
    FROM income
    JOIN users ON income.user_id = users.user_id
    where users.user_id = $1

    UNION

    SELECT
      'expense-' || expense_id AS uid,
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

  // Get request for all transactions dates by user
  router.get("/transactions/:id/dates", (req, res) => {
    const { id } = req.params

    const query = `
    SELECT
      DATE(last_payment_date) AS txn_date,
      amount,
      'Income' AS type
    FROM income
    WHERE user_id = $1

    UNION

    SELECT
    DATE(expense_date) AS txn_date,
    amount,
    'Expense' AS type
    FROM expenses
    WHERE user_id = $1
    `;

    db.query(query, [id])
    .then(({ rows }) => {
      return res.json(rows);
    })
    .catch((err) => {
      console.error('Error getting transaction dates:', err);
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
        return sendError(res, 404, `Transaction record with ID ${id} and type ${type} not found.`);
      }
      res.status(200).json({ message: "Transaction record deleted successfully." });
    })
    .catch((err) => {
      console.error('Error deleting transaction record:', err);
      sendError(res, 500, 'Failed to delete transaction');
    });
  });

  return router;
};