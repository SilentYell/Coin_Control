const router = require("express").Router();

module.exports = db => {
  router.get("/income", (req, res) => {
    const protocol = req.protocol;
    const host = req.hostname;
    const port = process.env.PORT;
    const serverUrl = `${protocol}://${host}:${port}`;


    const userId = 1 // change this later to be dynamic
    const queryParams = [userId]

    const query = `
    SELECT
        *
    FROM income
    WHERE user_id = $1s
    `

    db.query(query, queryParams)
    .then(({ rows }) => {
      console.log(res.json(rows[0]));
      res.json(rows[0]);
    });
  });

  return router;
}