const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/:id', (req, res) => {
    console.log("is", req.params.id);

    const templateVars = { user: req.session.user };
    const user = req.session.user.id;
    const resource_id = req.params.id;
    console.log("Req sess user", req.session.user);
    console.log("Params", resource_id);
    if (req.session.user) {
      const user = req.session.user.id;
      console.log(`user: ${user}`);
      // const query = (`SELECT resources.id AS resource_id,
      // resources.title,
      // resources.url,
      // resources.description,
      // users.id AS User_id
      // FROM resources JOIN users ON resources.user_id = users.id
      // WHERE users.id = $1
      // GROUP BY resources.id,
      // resources.title,
      // resources.url,
      // resources.description,
      // resources.user_id,
      // users.id;`);

      // const values = [user];
      // db.query(query, values)
      // .then(result => {

      const templateVars = {
        resource_id: req.params.id,
        user: user
      };
      // console.log("rows", result.rows[0])
      res.render('new_comment', templateVars);

    }
  });


  router.post('/comment', (req, res) => {
    console.log(req.body);
    const user = req.session.user.id;
    // console.log(res.rows.id);
    const resource_Id = req.body.resource_id;
    const message = req.body.message;
    // console.log("This is the user_id",req.session.user.id);
    // console.log("resourceId", resource_Id);

    db.query(
      `INSERT INTO comments (user_Id, resource_id, message) VALUES ($1, $2, $3) RETURNING *`,
      [user, resource_Id, message]
    )
      .then((data) => {
        // templateVars={
        //   ResourceId : data.rows,
        //   user : req.session.user.id

        // }
        // res.redirect("/api/resources/:id");
        res.send('success')
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });


  return router;

};
