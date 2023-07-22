const { default: axios } = require("axios");
const { getUserByToken } = require("../helpers/utils");
const db = require("../models");
const Bookmark = db.bookmarks;
const Op = db.Sequelize.Op;

// Create and Save a new Bookmark
exports.create = async (req, res) => {
  const token = req.headers['authorization'].split(" ")[1];
  const userByToken = await getUserByToken(token)
  // const {recipeId} = req.body

  // Save Bookmark in the database
  try {
    // const recipeDetail = (await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    // const equipmentsDetail = (await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/equipmentWidget.json?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    // const ingredientsDetail = (await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    // const instructionsDetail = (await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    const recipe = await Recipe.findOne({where: {
      id
    }})
    const formattedResponse = {
      id: recipe.id,
      title: recipe.title,
      thumbnail: recipe.thumbnail,
      equipments: recipe.equipments,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      videoUrl: recipe.video_url
    }
    const payload = {
      user_id: userByToken.id,
      title: formattedResponse.title,
      recipe_id: formattedResponse.id,
      body: formattedResponse
    };
    const existBookmark = await Bookmark.findOne({where: {recipe_id: formattedResponse.id, user_id: userByToken.id}})

    if (existBookmark) {
      return res.status(400).send({
        success: false,
        message: 'Gagal menyimpan, resep masakan sudah tersimpan!',
        data: null
      });
    }

    const data = await Bookmark.create(payload);

    return res.status(201).send({
      success: true,
      message: 'Berhasil menyimpan riwayat resep masakan!',
      data
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message:
        error.message || "Terjadi kesalahan saat menyimpan resep masakan",
      data: null
    });
  }
};

const formattedRow = (item) => {
  const obj = {...item}
  obj.body = JSON.parse(item.body)

  return obj
}

// Retrieve all Bookmarks/ find by title from the database
exports.findAll = async (req, res) => {
  const token = req.headers['authorization'].split(" ")[1];
  const userByToken = await getUserByToken(token)
  const condition = {}

  condition.user_id = { [Op.eq]: userByToken.id }

  try {
    const bookmarks = await Bookmark.findAll({ where: condition })
    const data = []

    for (const item of bookmarks) {
      const itemObj = await formattedRow(item.dataValues)

      data.push(itemObj)
    }

    return res.status(200).send({
      success: true,
      message: 'Berhasil menampilkan seluruh riwayat resep masakan!',
      data
    })
  } catch (error) {
    console.log(error)
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
          message: `Tidak dapat mencari riwayat resep masakan dengan id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Terjadi kesalahan saat mencari riwayat resep masakan dengan id=" + id
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
          message: "Berhasil mengubah riwayat resep masakan!"
        });
      } else {
        res.send({
          message: `Tidak dapat mengubah riwayat resep masakan dengan id=${id}. Mungkin riwayat resep masakan tidak ditemukan atau req.body kosong!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Terjadi kesalahan saat mengubah riwayat resep masakan dengan id=" + id
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
          success: true,
          message: 'Berhasil menghapus riwayat resep masakan!',
          data: null
        });
      } else {
        res.send({
          success: true,
          message: `Tidak dapat menghapus riwayat resep masakan dengan id=${id}. Mungkin riwayat resep masakan tidak ditemukan!`,
          data: null
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        success: true,
        message: "Terjadi kesalahan saat menghapus riwayat resep masakan dengan id=" + id,
        data: null
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
      res.send({ message: `${nums} Berhasil menghapus seluruh riwayat resep masakan!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Terjadi kesalahan saat menghapus seluruh riwayat resep masakan"
      });
    });
};
