const router = require("express").Router();

module.exports = db => {
  router.get("/income", (req, res) => {
    const userId = 1; // change this later to be dynamic
    const queryParams = [userId]

    const query = `
    SELECT
        *
    FROM income
    WHERE user_id = $1;
    `;

    db.query(query, queryParams)
    .then(({ rows }) => {
      res.json(rows);
    });
  });


  router.post("/income", (req, res) => {
    const { amount, last_payment_date, frequency } = req.body;
    const user_id = 1 // should come from req.body, will change to handle dynamic user ID later


    const query = `
    INSERT INTO income (user_id, amount, last_payment_date, frequency)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

    const queryParams = [user_id, amount, last_payment_date, frequency];

    db.query(query, queryParams)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => {
      console.error('Error inserting income', err);
      res.status(500).json({error: 'Internal server error'});
    });
  });


  return router;
};