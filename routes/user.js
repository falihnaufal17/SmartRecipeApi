// /register
// /login
// /delete-user

module.exports = app => {
  const users = require("../controllers/user.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/register", users.create);

  app.use('/api/account', router);
}