const express = require("express");
const router = express.Router();

module.exports = (db) => {


  router.get('/new', (req, res) => {
    const user_id = req.session.user.id;
    const templateVars = { user: user_id };
    if (!user_id) {
      res.redirect('/', templateVars);
    } else {
      const templateVars = {
        user: user_id
      };
      res.render('new_resource', templateVars);
    }
  });

// this route creates a new card//
  router.post('/new', (req, res) => {
    const user_Id = req.session.user.id;
    const { title, url, description, category } = req.body;
    const date = new Date();
    console.log(req.session);
    db.query(
      `INSERT INTO resources (user_Id, url, title, description, category, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_Id, url, title, description, category, date]
    )
      .then((data) => {
        const newResource = data.rows[0];
        res.redirect('/');
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });

  return router;

};
