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
    const user_id = req.session.user.id;
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
    const user_Id = req.session.user.id;
    const { title, url, description, category } = req.body;
    const date = new Date();
    console.log("this is the reqbody",req.body);
    console.log(req.session);
    db.query(
      `INSERT INTO resources (user_Id, url, title, description, category, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_Id, url, title, description, category, date]
    )
      .then((data) => {
        const newResource = data.rows[0];
        console.log("thisis the data",newResource);
        res.redirect('/', newResource);
      })
      .catch((error) => {
        console.log(error)
        // res.status(500).json({ error: error.message });
      });
  });

  return router;

};
