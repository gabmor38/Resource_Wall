/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // register a new user. Create new user resource.
  router.post('/', (req, res) => {
    const user = req.body;
    console.log(`email: ${user.email}`);
    console.log(`password: ${user.password}`);
    return db.query(`
      INSERT INTO users ( email, password)
      VALUES ($1, $2)
      RETURNING *;
    `, [user.email, user.password])
      .then((results) => {
        console.log("Added new user.");
        res.status(200).send();
      })
      .catch((err) => {
        throw err;
      })
  });

  return router;
};
