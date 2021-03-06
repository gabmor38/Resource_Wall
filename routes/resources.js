//resource url page
const express = require('express');
const router = express.Router();

module.exports = (db) => {



  router.post("/search", (req, res) => {
    console.log("search", req.body.search)

    searchedTerm = req.body.search;

    const query = `SELECT resources.description, resources.id, resources.category, resources.title, resources.url, ROUND(AVG(reviews.rating), 1) AS rating
        from resources
        JOIN reviews ON resources.id=reviews.resource_id
        WHERE resources.description LIKE '%' || $1 || '%'
        GROUP BY resources.id, resources.title, resources.url, reviews.resource_id;`
    const values = [searchedTerm];
    db.query(query, values)
      .then(result => {
        console.log("user is", req.session.user)
        console.log("rows", result.rows)
        const templateVars = {
          resources: result.rows,
          user: req.session.user
        };
        console.log("tv is", templateVars)
        res.render("index", templateVars);

      })
      .catch(err => console.log(err));
  });

  // This api creates a new resource
  // TODO: add support to redirect to home page after creation of resource.
  router.post("/", (req, res) => {
    if (req.session.user) {
      const userId = req.session.user.id;
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
          //   user: req.session.user.id
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

  //this function will be called by homepage when user is logged in. Query the database for stuff user liked/favourited and send to this function

  const cardBuilder = function (resources) {
    let resourceCards = []
    for (resource in resources) {

      let resourceCard = `
  <div class="card-deck">
            <div class="card">
              <div >
               <i class="fa-regular fa-heart"></i>
               <p> number of likes</p>
              </div>
              <img src="/images/${resource.category}.jpeg" class="card-img-top" alt="${resource.category}">
              <div class="card-body">
                <h5 class="card-title">${resource.title}</h5>
                <p class="card-text">${resource.description}</p>
              </div>
            </div>
          </div>
    `
      resourceCards.push(resourceCard)
    }
    return resourceCards
  }


  // This api returns the resources to be shown on resource wall for a user
  // which contains all resources which are either created by this user or any resourse liked by anyone.
  router.get("/", (req, res) => {
    console.log("getting resources")
    console.log("userrrr", req.session.user)
    if (req.session.user) {
      const user = req.session.user;
      console.log("user")
      console.log(`userId: ${user.id}`);
      const query = `select resources.id, resources.category, resources.title, resources.description, resources.url, (select count(*) from liked where resource_id = resources.id) as number_of_likes,
      (select count(*) from comments where resource_id = resources.id) AS number_of_comments,
      ROUND(AVG(reviews.rating), 0) AS rating,
            case when (select count(*) from liked where user_id = $1 and resource_id = resources.id) > 0 then 'YES' else 'NO' end as liked
            from resources
            LEFT JOIN reviews ON resources.id = reviews.resource_id
            left join liked on resources.id = liked.resource_id
            LEFT join comments on resources.id =  comments.resource_id
            group by reviews.resource_id, liked.resource_id, resources.id, resources.category, resources.title, resources.description, resources.url, comments.resource_id
            order by resources.id;`
      const values = [user.id];
      db.query(query, values)
        .then(result => {
          console.log("rows")
          console.log("rows", result.rows)

          const templateVars = {
            resources: result.rows,
            user: user
          };

          if (!templateVars.resources[0]) {
            console.log("triggered if")
          }
          console.log(templateVars);
          res.render("index", templateVars);
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
    if (req.session.user) {
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
          //   user: req.session.user.id
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

  // This api is used to like a resource, works like a toggle button
  router.post("/:id/like/:isliked", (req, res) => {
    if (req.session.user) {
      const resourceId = req.params.id;
      const isliked = req.params.isliked;
      const userId = req.session.user.id;
      // TODO: make sure, id, user_id, number_of_likes, date are not mentioned in body
      console.log(`resource: ${resourceId}`);
      let queryText = `insert into liked (user_id, resource_id) values ($1,$2)
      RETURNING *`;
      if (isliked === 'YES') {
        queryText = `delete from liked where user_id=$1 and resource_id=$2
        RETURNING *`;
      }
      const query = {
        text: queryText,
        values: [
          userId,
          resourceId
        ]
      };
      db.query(query)
        .then(result => {
          res.redirect(`/`);
        })
        .catch(err => console.log(err));
    } else {
      // TODO: redirect to the login page, for now send empty response
      res.json({ 'data': null });
    }
  });

  router.get("/my_resources", (req,res)=>{
    console.log("getting my_resources")
    console.log("userrrr", req.session.user)
    if (req.session.user) {
      const user = req.session.user;
      console.log("user")
      console.log(`userId: ${user.id}`);
      const query = `select resources.id, resources.category, resources.title, resources.description, resources.url, (select count(*) from liked where resource_id = resources.id) as number_of_likes,
      (select count(*) from comments where resource_id = resources.id) AS number_of_comments,
      ROUND(AVG(reviews.rating), 0) AS rating,
            case when (select count(*) from liked where user_id = $1 and resource_id = resources.id) > 0 then 'YES' else 'NO' end as liked
            from resources
            LEFT JOIN reviews ON resources.id = reviews.resource_id
            left join liked on resources.id = liked.resource_id
            LEFT join comments on resources.id =  comments.resource_id
            where resources.user_id = $1 OR liked.user_id = $1
            group by reviews.resource_id, liked.resource_id, resources.id, resources.category, resources.title, resources.description, resources.url, comments.resource_id
            order by resources.id;`
      const values = [user.id];
      db.query(query, values)
        .then(result => {
          console.log("rows")
          console.log("rows", result.rows)

          const templateVars = {
            resources: result.rows,
            user: user
          };

          if (!templateVars.resources[0]) {
            console.log("triggered if")
          }
          console.log(templateVars);
          res.render("my_resources", templateVars);
        })
        .catch(err => console.log(err));
    } else {
      // TODO: redirect to the login page, for now send empty response
      res.json({ 'data': null });
    }
  });


  return router;
};
