const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/:id', (req, res) => {
    // const templateVars = { user: req.session.user };
    // const user = req.session.user.id;
    const resource_id = req.params.id;
    console.log("Req sess user", req.session.user);
    console.log("Params", resource_id);
    if (req.session.user) {
      const user = req.session.user.id;
      console.log(`user: ${user}`);
      const templateVars = {
        resource_id: req.params.id,
        user: user
      };
      res.render('new_comment', templateVars);
    }
  });
//Adds a comment and redirects to the main resource page.
  router.post('/comment', (req, res) => {
    console.log(req.body);
    const user = req.session.user.id;
    const resource_Id = req.body.resource_id;
    const message = req.body.message;
    db.query(
      `INSERT INTO comments (user_Id, resource_id, message) VALUES ($1, $2, $3) RETURNING *`,
      [user, resource_Id, message]
    )
      .then((data) => {
        // templateVars={
        //   ResourceId : data.rows,
        //   user : req.session.user.id
        // }
        res.redirect("/api/resources/");
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
  return router;
};
