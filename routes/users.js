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

  // // register a new user. Create new user resource.
  router.post('/', (req, res) => {
  //   const user = req.body;
  //   console.log(`email: ${user.email}`);
  //   console.log(`password: ${user.password}`);
  //   return db.query(`
  //     INSERT INTO users ( email, password)
  //     VALUES ($1, $2)
  //     RETURNING *;
  //   `, [user.email, bcrypt.hashSync(user.password, 12)])
  //     .then((results) => {
  //       console.log("Added new user.");
  //       res.redirect('/api/users/login');
  //     })
  //     .catch((err) => {
  //       throw err;
  //     })

  });

  // login
  router.get('/login', (req, res) => {

    const user_id = req.session.user_id;
    const templateVars = { error: null, user_id: user_id };
    res.render("login", templateVars);
  });

  const login = function (email, password) {
    return db.query(`
  SELECT *
  FROM users
  WHERE email= $1`
      , [`${email}`])
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
    console.log("POST login",req.body);
    login(email, password)
      .then(user => {
       console.log(user)

        if (!user) {
          res.send({ error: "error" });
          return;
        }
        const user_id = user.email;
        req.session.user_id = user_id;
        console.log(`User session is ${req.session.user_id}`);
        // res.send({ user: { email: user.email, id: user.id } });
        const templateVars = { error: null, user_id: user_id };
        res.render("index", templateVars);
      })
      .catch(e => res.send(e));
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect('/');
  });

  router.get('/register', (req, res) => {
    res.render('register');
  });

  return router;
 };
