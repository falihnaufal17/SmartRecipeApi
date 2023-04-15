module.exports = app => {
  const rating = require("../controllers/rating.js");
  var router = require("express").Router();

  router.post("/add-rating", rating.create);

  app.use('/api/rating', router);

  // full endpoint api nya: localhost:3000/api/rating/add-rating
}