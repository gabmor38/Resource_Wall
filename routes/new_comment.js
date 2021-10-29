const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/comment', (req, res) => {
    console.log("user is",req.session.user)
    const templateVars = { user: req.session.user };
    if (!req.session.user) {
      res.redirect('/', templateVars);
    } else {

      res.render('new_comment', templateVars);
    }
  });


  router.post('/comment', (req, res) => {
    const user_Id = req.session.user.id;
    console.log("body" ,req.body);

    db.query(
      `INSERT INTO comments (user_Id, resource_id, message) VALUES ($1, $2, $3) RETURNING *`,
      [user_Id, resource_id, message]
    )
      .then((data) => {
        templateVars={
          newResource : data.rows,
          user : req.session.user

        }
        res.redirect("/api/resources/:id");
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });


  return router;








}
