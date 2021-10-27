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
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);
    if (!email || !password) {
      // res.statusCode = 400;
      // res.send("Email id or password can't be blank");
      // return;
      const templateVars = { error: 'Email id or password can not be blank', user_id: email };
      res.render("register", templateVars);
    }
    if (getUserByEmail(email)) {
      // res.status(400);
      // res.send("Email already exist");
      // return;
      const templateVars = { error: 'Email already exist', user_id: email };
      res.render('register', templateVars);
    }
    return db.query(`
      INSERT INTO users ( email, password)
      VALUES ($1, $2)
      RETURNING *;
    `, [email, bcrypt.hashSync(password, 12)])
      .then((results) => {
        console.log("Added new user.");
        res.redirect('/api/users/login');
      })
      .catch((err) => {
        throw err;
      })
  });

  //create email lookup helper function
  const getUserByEmail = function (email) {
    db.query(
      `SELECT * FROM users
      where email = $1;`, [email])
      .then(data => {
        const users = data.rows;
        return users;
      })
      .catch(err => {
        return null;
      });
  };

  // login
  router.get('/login', (req, res) => {

    const user = req.session.user_id;
    const templateVars = { error: null, user };
    res.render("login", templateVars);
  });

  const login = function (email, password) {
    return db.query(`
  SELECT *
  FROM users
  WHERE email= $1`
      , [`${email}`])
      .then(user => {
        console.log(`got user ${user.rows[0]}`);
        return user.rows[0];
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      });
  }
  exports.login = login;

  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);
    login(email, password)
      .then(user => {
        console.log(user)

        if (!user) {
          // res.send({ error: "error" });
          // return;
          const templateVars = { error: "Email and Password should not be empty", user: null };
          return res.render("login", templateVars);

        }
        const user_id = user.id;
        req.session.user_id = user_id;
        console.log(`User session is ${req.session.user_id}`);
        // res.send({ user: { email: user.email, id: user.id } });
        const templateVars = { error: null, user_id: user_id };
        res.redirect("/api/resources/");
      })
      .catch(console.log("error"));
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
