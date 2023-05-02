const { default: axios } = require("axios");
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const fs = require("fs");

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
      model_id: "food-item-recognition",
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

      console.log("Predicted concepts:");
      for (const concept of output.data.concepts.sort()) {
        console.log(concept.name + " " + concept.value);
      }

      axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=3798ef43760f4a10982037daf9a35c40&ingredients=${output.data.concepts[0].name}`)
        .then((spoonacularResponse) => {
          const data = spoonacularResponse.data.results;
          console.log("response Spoon", spoonacularResponse.data)
          return res.status(200).send({
            message: 'Image food detected',
            data: data ?? []
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