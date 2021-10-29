const express = require("express");
const router = express.Router();

module.exports = (db) => {


  router.get('/new', (req, res) => {
    console.log("user is",req.session.user)
    const templateVars = { user: req.session.user };
    if (!req.session.user) {
      res.redirect('/', templateVars);
    } else {

      res.render('new_resource', templateVars);
    }
  });

// this route creates a new card//
  router.post('/new', (req, res) => {
    const user_Id = req.session.user.id;
    const { title, url, description, category } = req.body;

    const date = new Date();
    db.query(
      `INSERT INTO resources (user_Id, url, title, description, category, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_Id, url, title, description, category, date]
    )
      .then((data) => {
        templateVars={
          newResource : data.rows,
          user : req.session.user

        }
        res.redirect("/api/resources/");
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });

  return router;

};
