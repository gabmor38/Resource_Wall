//resource url page
const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // Get a resource by id. This api might be used for edit resource page.
  router.get("/:id", (req, res) => {
    const resourceId = req.params.id;
    if (req.session.user_id) {
      console.log(`resourceId: ${resourceId}`);
      const query = {
        text: `SELECT * FROM resources WHERE id = $1`,
        values: [resourceId]
      };
      db.query(query)
        .then(result => {
          const resource = result.rows[0];
          res.json(resource);
          // TODO: Fix below code for the UI support.
          // const templateVars = {
          //   resource: resource
          // }
          // res.render("edit_url", templateVars);
        })
        .catch(err => console.log(err))
    } else {
      // TODO: redirect to the login page, for now send empty response
      res.json({ 'data': null });
    }
  });

  // This api creates a new resource
  // TODO: add support to redirect to home page after creation of resource.
  router.post("/", (req, res) => {
    if (req.session.user_id) {
      const userId = req.session.user_id;
      const resource = req.body;
      console.log(`userId: ${userId}`)
      console.log(`resource: ${resource}`);
      const query = {
        text: `INSERT INTO resources (id, user_id, number_of_likes, url, title, description, category, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        values: [
          resource.id,
          resource.user_id,
          resource.number_of_likes,
          resource.url,
          resource.title,
          resource.description,
          resource.category,
          resource.date
        ]
      };
      db.query(query)
        .then(result => {
          res.json({ 'data': 'success' });
          // TODO: Fix below code for the UI support.
          // const templateVars = {
          //   user: req.session.user_id
          // };
          // console.log("templateVars", templateVars);
          // res.redirect(`login/${userId}`);
        })
        .catch(err => console.log(err));
    } else {
      // TODO: redirect to the login page, for now send empty response
      res.json({ 'data': null });
    }
  });

  // This api returns the resources to be shown on resource wall for a user
  // which contains all resources which are either created by this user or any resourse liked by anyone.
  router.get("/", (req, res) => {
    if (req.session.user_id) {
      const userId = req.session.user_id;
      console.log(`userId: ${userId}`);
      const query = {
        text: `select resources.id, resources.title, resources.url, ROUND(AVG(reviews.rating), 1) AS rating
        from resources
        join reviews on reviews.resource_id = resources.id
        where resources.user_id = $1 OR number_of_likes > 0
        group by resources.id, resources.title, resources.url, reviews.resource_id`,
        values: [userId]
      };
      db.query(query)
        .then(result => {

          const resources = result.rows;
          res.json({ resources });

          // TODO: fix below code for UI support
          // const templateVars = {
          //   resources: result.rows,
          //   user: user_id
          // };
          // console.log(templateVars);
          // res.render("homepage", templateVars);
        })
        .catch(err => console.log(err));
    } else {
      // TODO: redirect to the login page, for now send empty response
      res.json({ 'data': null });
    }
  });

  // This api edits a resource
  // TODO: add support to redirect to home page after editing the resource.
  router.post("/:id", (req, res) => {
    if (req.session.user_id) {
      const resource = req.body;
      const resourceId = req.params.id;

      // TODO: make sure, id, user_id, number_of_likes, date are not mentioned in body
      console.log(`resource: ${resource}`);
      const query = {
        text: `UPDATE resources
        SET
          url = $1,
          title = $2,
          description = $3,
          category = $4
        WHERE id = $5
        RETURNING *`,
        values: [
          resource.url,
          resource.title,
          resource.description,
          resource.category,
          resourceId
        ]
      };
      db.query(query)
        .then(result => {
          res.json({ 'data': 'success' });
          // TODO: Fix below code for the UI support.
          // const templateVars = {
          //   user: req.session.user_id
          // };
          // console.log("templateVars", templateVars);
          // res.redirect(`login/${userId}`);
        })
        .catch(err => console.log(err));
    } else {
      // TODO: redirect to the login page, for now send empty response
      res.json({ 'data': null });
    }
  });

  return router;
};
