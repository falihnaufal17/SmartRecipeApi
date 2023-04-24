const db = require("../models");
const Bookmark = db.bookmarks;
const Op = db.Sequelize.Op;

// Create and Save a new Bookmark
exports.create = async (req, res) => {
  if (!req.body.userId || req.body.userId.length === 0) {
    res.status(400).send({
      message: "User ID harus diisi!",
    });
    return;
  }

  if (!req.body.title || req.body.title.length === 0) {
    res.status(400).send({
      message: "Judul harus diisi!",
    });
    return;
  }

  // Create a Bookmark
  const payload = {
    user_id: req.body.userId,
    title: req.body.title,
  };

  // Save Bookmark in the database
  try {
    const data = await Bookmark.create(payload);

    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Bookmark.",
    });
  }
};

// Retrieve all Bookmarks/ find by title from the database
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Bookmark.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving bookmarks."
      });
    });
};

// Find a single Bookmark with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Bookmark.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Bookmark with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Bookmark with id=" + id
      });
    });
};

// Update a Bookmark identified by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Bookmark.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Bookmark was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Bookmark with id=${id}. Maybe Bookmark was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Bookmark with id=" + id
      });
    });
};

// Delete a Bookmark with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Bookmark.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Bookmark was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Bookmark with id=${id}. Maybe Bookmark was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Bookmark with id=" + id
      });
    });
};

// Delete all Bookmarks from the database
exports.deleteAll = (req, res) => {
  Bookmark.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Bookmarks were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Bookmarks."
      });
    });
};
