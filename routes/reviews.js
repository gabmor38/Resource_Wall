const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.post("/review",(req,res)=>{
    console.log("add review")
    console.log(req.body)
    const date = new Date();

    console.log(`${req.body.resourceId}`,`${req.body.userId}`,`${req.body.rating}`)
    const query = {
      text: `insert into reviews (resource_id, user_id, rating) values ($1,$2,$3)
      RETURNING *`,
      values: [`${req.body.resourceId}`,`${req.body.userId}`,`${req.body.rating}`]
    };
    return db.query(query)
    .then(result=>{
      res.redirect('/')
    })
  })
  return router
}
