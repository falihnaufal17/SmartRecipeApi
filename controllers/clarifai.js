const { default: axios } = require("axios");
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const fs = require("fs");
const { getUserByToken } = require("../helpers/utils");
const db = require("../models");
const Bookmark = db.bookmarks;

exports.detector = (req, res) => {
  const stub = ClarifaiStub.grpc();
  const metadata = new grpc.Metadata();
  const imageBytes = fs.readFileSync(req.file.path);

  metadata.set("authorization", "Key " + "03a1536584404599bb8a6fd75100f70e");

  stub.PostModelOutputs(
    {
      user_app_id: {
        "user_id": "clarifai",
        "app_id": "main"
      },
      model_id: "general-image-detection",
      // version_id: "1d5fd481e0cf4826aa72ec3ff049e044",  // This is optional. Defaults to the latest model version
      inputs: [
        { data: { image: { base64: imageBytes } } }
      ]
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error("Post model outputs failed, status: " + response.status.description);
      }

      const output = response.outputs[0];
      const ingredients = [];

      console.log("Predicted concepts:");
      // console.log(output.data.regions);
      for (const region of output.data.regions) {
        ingredients.push(region.data.concepts[0].name);
        console.log(region.data.concepts[0].name);
      }

      axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=3798ef43760f4a10982037daf9a35c40&ingredients=${ingredients.join(',')}&number=${100}`)
        .then((spoonacularResponse) => {
          const data = {
            detectedIngredients: ingredients,
            data: spoonacularResponse.data
          };
          console.log("response Spoon", spoonacularResponse.data)
          return res.status(200).send({
            message: 'Image food detected',
            data
          })
        }).catch(spoonacularResponseErr => {
          return res.status(500).send({
            message: spoonacularResponseErr.response.data,
            data: []
          })
        })
    }
  );
}

exports.detail = async (req, res) => {
  const {id} = req.params
  const token = req.headers['authorization'].split(" ")[1];
  const userByToken = await getUserByToken(token)

  try {
    const recipeDetail = (await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    const equipmentDetail = (await axios.get(`https://api.spoonacular.com/recipes/${id}/equipmentWidget.json?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    const ingredientsDetail = (await axios.get(`https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    const instructionDetail = (await axios.get(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=3798ef43760f4a10982037daf9a35c40`)).data
    const bookmarkByUserId = await Bookmark.findAll({ where: {user_id: userByToken.id} })
    let isBookmarked = false
    let bookmarkId = null

    bookmarkByUserId.forEach(item => {
      if (item.recipe_id == id && item.user_id == userByToken.id) {
        isBookmarked = true
        bookmarkId = item.id
      }
    })

    const formattedResponse = {
      id: recipeDetail?.id,
      title: recipeDetail?.title,
      image: recipeDetail?.image,
      equipments: equipmentDetail?.equipment,
      ingredients: ingredientsDetail?.ingredients,
      instructions: instructionDetail,
      isBookmarked,
      bookmarkId
    }

    return res.status(200).send({
      message: 'Success get detail recipe',
      data: formattedResponse
    })
  } catch (e) {
    return res.status(500).send({
      message: e.response.data,
      data: null
    })
  }
}