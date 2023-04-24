module.exports = (app) => {
  const users = require("../controllers/user.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/register", users.create);

  // Login
  router.get("/login", users.findOne);

  // Delete a User with id
  router.delete("/delete-user:id", users.delete);

  app.use("/api/account", router);
};
