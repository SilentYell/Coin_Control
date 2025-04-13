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

  return router;
};