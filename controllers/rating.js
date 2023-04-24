const db = require("../models");
const Rating = db.ratings;
const Op = db.Sequelize.Op;

// Create and Save a new Rating
exports.create = async (req, res) => {
  if (!req.body.userId || req.body.userId.length === 0) {
    res.status(400).send({
      message: "User ID harus diisi!",
    });
    return;
  }

  if (!req.body.rate || req.body.rate.length === 0) {
    res.status(400).send({
      message: "Rating harus diisi!",
    });
    return;
  }

  if (!req.body.review || req.body.review.length === 0) {
    res.status(400).send({
      message: "Review harus diisi!",
    });
    return;
  }

  // Create a Rating
  const payload = {
    user_id: req.body.userId,
    rate: req.body.rate,
    review: req.body.review,
  };

  // Save Rating in the database
  try {
    const data = await Rating.create(payload);

    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Bookmark.",
    });
  }
};

// Retrieve all Ratings/ find by user_id from the database
exports.findAll = (req, res) => {
  const userId = req.query.userId;
  var condition = userId ? { userId: { [Op.like]: `%${userId}%` } } : null;

  Rating.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ratings."
      });
    });
};

// Find a single Rating with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Rating.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Rating with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Rating with id=" + id
      });
    });
};

// Update a Rating identified by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Rating.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Rating was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Rating with id=${id}. Maybe Rating was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Rating with id=" + id
      });
    });
};

// Delete a Rating with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Rating.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Rating was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Rating with id=${id}. Maybe Rating was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Rating with id=" + id
      });
    });
};

// Delete all Ratings from the database
exports.deleteAll = (req, res) => {
  Rating.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Ratings were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Ratings."
      });
    });
};
