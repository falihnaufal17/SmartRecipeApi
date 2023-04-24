module.exports = (app) => {
  const rating = require("../controllers/rating.js");
  
  var router = require("express").Router();

  // Create a new Rating
  router.post("/add-rating", rating.create);

  // Retrieve all Ratings
  router.get("/get-rating", rating.findAll);

  // Retrieve a single Rating with id
  router.get("/get-rating:id", rating.findOne);

  // Update a Rating with id
  router.put("/edit-rating:id", rating.update);

  // Delete a Rating with id
  router.delete("/delete-rating:id", rating.delete);

  // Delete all Ratings
  router.delete("/delete-rating", rating.deleteAll);

  app.use("/api/rating", router);

  // full endpoint api nya: localhost:3000/api/rating/add-rating
};
