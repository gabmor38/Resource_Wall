const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // router.get("/", (req, res) => {
  //   const query = `SELECT * FROM resources`;
  //   db.query(query)
  //     .then((data) => {
  //       res.json(data.rows)
  //     })
  //     .catch((e) => {
  //       res.status(500).json ({error: e.message});
  //   });

  router.get('/new', (req, res) => {
    const user_id = req.session.user_id;
    const templateVars = { user: user_id };
    console.log("this is the vars in New Get",templateVars);
    if (!user_id) {
      res.redirect('/', templateVars);
    } else {
      const templateVars = {
        user: user_id
      };
      res.render('new_resource', templateVars);
    }
  });

  router.post('/new', (req, res) => {
    const { user_id } = req.session;
    const { url, title, description } = req.body;
    console.log(req.body);
    console.log(req.session);
    db.query(
      `INSERT INTO resources (user_id, url, title, description) VALUES ($1,$2, $3, $4) RETURNING *`,
      [user_id, url, title, description]
    )
      .then((res2) => {
        res.redirect('/users/login');
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });

  return router;

};
