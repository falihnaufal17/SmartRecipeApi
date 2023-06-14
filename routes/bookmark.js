const { authorization } = require("../middleware/auth.js");

module.exports = (app) => {
  const bookmark = require("../controllers/bookmark.js");
  
  var router = require("express").Router();

  // Create a new Bookmark
  router.post("/add-bookmark", authorization, bookmark.create);
  
  // Retrieve all Bookmarks
  router.get("/get-bookmark", authorization, bookmark.findAll);

  // Retrieve a single Bookmark with id
  router.get("/get-bookmark:id", bookmark.findOne);

  // Update a Bookmark with id
  router.put("/edit-bookmark:id", bookmark.update);

  // Delete a Bookmark with id
  router.delete("/delete-bookmark/:id", authorization, bookmark.delete);

  // Delete all Bookmarks
  router.delete("/delete-bookmark", bookmark.deleteAll);

  app.use("/api/bookmark", router);

  // full endpoint api nya: localhost:3000/api/bookmark/add-bookmark
};
