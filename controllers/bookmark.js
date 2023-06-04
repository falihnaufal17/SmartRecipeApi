const { default: axios } = require("axios");
const { getUserByToken } = require("../helpers/utils");
const db = require("../models");
const Bookmark = db.bookmarks;
const Op = db.Sequelize.Op;

// Create and Save a new Bookmark
exports.create = async (req, res) => {
  const token = req.headers['authorization'].split(" ")[1];
  const userByToken = await getUserByToken(token)
  const {recipeId} = req.body

  // Save Bookmark in the database
  try {
    const recipeDetail = (await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    const equipmentDetail = (await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/equipmentWidget.json?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    const ingredientsDetail = (await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    const instructionDetail = (await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    const formattedResponse = {
      id: recipeDetail?.id,
      title: recipeDetail?.title,
      image: recipeDetail?.image,
      equipments: equipmentDetail?.equipment,
      ingredients: ingredientsDetail?.ingredients,
      instructions: instructionDetail
    }
    const payload = {
      user_id: userByToken.id,
      title: formattedResponse.title,
      body: JSON.stringify(formattedResponse)
    };

    const data = await Bookmark.create(payload);

    return res.status(201).send({
      success: true,
      message: 'Add to bookmark successfully',
      data
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message:
        error.message || "Some error occurred while creating the Bookmark.",
      data
    });
  }
};

// Retrieve all Bookmarks/ find by title from the database
exports.findAll = async (req, res) => {
  const title = req.query.title;
  const token = req.headers['authorization'].split(" ")[1];
  const userByToken = await getUserByToken(token)
  const condition = {}

  if (title) {
    condition.title = { [Op.like]: `%${title}%` }
  }

  condition.user_id = { [Op.eq]: userByToken.id }

  try {
    const bookmarks = await Bookmark.findAll({ where: condition })

    return res.status(200).send({
      success: true,
      message: 'Success get all bookmarks',
      data: bookmarks
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
      data: null
    })
  }
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
