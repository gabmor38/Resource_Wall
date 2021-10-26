/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        console.log(users);
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
    //Create the session with the hardcoded value
    req.session.user_id = 1;
    res.redirect('/login');
    //res.redirect("/api/resources/1");

    // const user = req.body;
    // console.log(`email: ${user.email}`);
    // console.log(`password: ${user.password}`);
    // return db.query(`
    //   INSERT INTO users ( email, password)
    //   VALUES ($1, $2)
    //   RETURNING *;
    // `, [user.email, bcrypt.hashSync(user.password, 12)])
    //   .then((results) => {
    //     console.log("Added new user.", results);
    //     res.status(200).send();
    //   })
    //   .catch((err) => {
    //     throw err;
    //   })
  });

  // login
  router.get('/login', (req, res) => {
    const user_id = req.session.user_id;
    // send user_id in template vars
    res.render('login');
  });

  /**
   * Check if a user exists with a given username and password
   * @param {String} email
   * @param {String} password encrypted
   */
  const login = function (email, password) {
    return db.query(`
      SELECT *
      FROM users
      WHERE email= $1`
      , [`${email.toLowerCase()}`])
      .then(result => result.rows[0])
      .catch(err => console.log(err))
      .then(user => {
        console.log(`got user ${user}`);
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      });
  }
  exports.login = login;

  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res.send({ error: "error" });
          return;
        }
        req.session.userId = user.id;
        console.log(`User session is ${req.session.userId}`);
        res.send({ user: { email: user.email, id: user.id } });
      })
      .catch(e => res.send(e));
  });

  router.post('/logout', (req, res) => {
    req.session.userId = null;
    res.send({});
  });

  router.get('/register', (req, res) => {
    res.render('register');
  });

  return router;
};
