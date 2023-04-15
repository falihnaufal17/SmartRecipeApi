module.exports = app => {
  const bookmark = require("../controllers/bookmark.js");
  var router = require("express").Router();

  router.post("/add-bookmark", bookmark.create);

  app.use('/api/bookmark', router);

  // full endpoint api nya: localhost:3000/api/bookmark/add-bookmark
}