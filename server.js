// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const newComment = require("./routes/new_comment");
const widgetsRoutes = require("./routes/widgets");
const newResource = require("./routes/new_resource");
const resourceRoutes = require("./routes/resources")
const reviewRoutes = require("./routes/reviews")




// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use('/api/new_comment',newComment(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use('/api/new_resource',newResource(db));
app.use("/api/resources", resourceRoutes(db))
app.use("/api/reviews", reviewRoutes(db))

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.redirect('/api/users/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
